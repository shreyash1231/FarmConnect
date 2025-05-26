import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
from sklearn.svm import SVR
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import joblib
import os
from warnings import filterwarnings
filterwarnings('ignore')

# Gradient Boosting Libraries
from xgboost import XGBRegressor
from catboost import CatBoostRegressor
from sklearn.preprocessing import StandardScaler
from flask import Flask, request, jsonify

from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

BASE_PATH = "C:\\Users\\SHREYASH\\Documents\\iLovePDF_Output\\ilovepdf-pdf-to-excel\\"

DATASETS = {
    "apple": BASE_PATH + "apple_jan2025.csv",
    "bajra": BASE_PATH + "bajra_jan2025.csv",
    "banana": BASE_PATH + "banana_jan2025.csv",
    "cotton": BASE_PATH + "Cotton_jan2025.csv",
    "grapes": BASE_PATH + "grapes_jan2025.csv",
    "groundnut": BASE_PATH + "Groundnut_jan2025.csv",
    "guava": BASE_PATH + "Guava_jan2025.csv",
    "jower": BASE_PATH + "Jower_jan2025.csv",
    "mango": BASE_PATH + "Mango_feb2025.csv",
    "orange": BASE_PATH + "orange_jan2025.csv",
    "pom": BASE_PATH + "pom_jan2025.csv",
    "rice": BASE_PATH + "Rice_jan2025.csv",
    "soyabean": BASE_PATH + "soyabean_jan2025.csv",
    "sunflower": BASE_PATH + "sunflower_jan2025.csv",
    "wheat": BASE_PATH + "wheat_jan2025.csv"
}

def clean_feature_names(name):
    """Clean feature names by removing special characters"""
    return str(name).replace('(', '_').replace(')', '_').replace(' ', '_').replace('/', '_')

def parse_date(date_str):
    """Parse dates in multiple possible formats"""
    if pd.isna(date_str):
        return pd.NaT
    
    date_formats = [
        '%m/%d/%Y', '%d-%m-%Y', '%m-%d-%Y', 
        '%d/%m/%Y', '%Y-%m-%d'
    ]
    
    for fmt in date_formats:
        try:
            return datetime.strptime(str(date_str), fmt)
        except ValueError:
            continue
    return pd.NaT

def load_and_preprocess(filepath):
    """Load and preprocess data with enhanced validation"""
    try:
        df = pd.read_csv(filepath)
        
        # Validate required columns
        required_columns = ['Arrival Date', 'Minimum Price(Rs./Quintal)', 'Maximum Price(Rs./Quintal)']
        if not all(col in df.columns for col in required_columns):
            print(f"Missing required columns in {filepath}")
            return None
        
        df['Arrival Date'] = df['Arrival Date'].apply(parse_date)
        df = df.dropna(subset=['Arrival Date']).sort_values('Arrival Date')
        
        # Clean and convert price columns
        for price_col in ['Minimum Price(Rs./Quintal)', 'Maximum Price(Rs./Quintal)', 'Modal Price(Rs./Quintal)']:
            if price_col in df.columns:
                df[price_col] = (
                    df[price_col]
                    .astype(str).str.replace(',', '').astype(float)
                )
            
        # Clean arrivals data if needed
        if 'Arrivals (Tonnes)' in df.columns:
            df['Arrivals_Tonnes'] = (
                df['Arrivals (Tonnes)']
                .astype(str).str.replace(',', '').astype(float)
            )
            
        # Clean market names
        if 'Market' in df.columns:
            df['Market'] = df['Market'].apply(clean_feature_names)
            
        return df
    except Exception as e:
        print(f"Error processing {filepath}: {str(e)}")
        return None

def prepare_features(df, target='Minimum Price(Rs./Quintal)'):
    """Feature engineering with cleaned feature names"""
    df['Days'] = (df['Arrival Date'] - df['Arrival Date'].min()).dt.days
    df['Day_of_week'] = df['Arrival Date'].dt.dayofweek
    df['Day_of_month'] = df['Arrival Date'].dt.day
    df['Month'] = df['Arrival Date'].dt.month
    df['Year'] = df['Arrival Date'].dt.year
    
    # Add moving averages if enough data exists
    if len(df) > 7:
        df['7_day_avg'] = df[target].rolling(7).mean()
    
    # Market dummy variables
    if 'Market' in df.columns:
        markets = pd.get_dummies(df['Market'], prefix='market')
    else:
        markets = pd.DataFrame()
    
    # Prepare base features
    base_features = ['Days', 'Day_of_week', 'Day_of_month', 'Month', 'Year']
    X = pd.concat([df[base_features], markets], axis=1)
    
    # Add other features if available
    if 'Arrivals_Tonnes' in df.columns:
        X['Arrivals_Tonnes'] = df['Arrivals_Tonnes']
    
    # Clean all feature names
    X.columns = [clean_feature_names(col) for col in X.columns]
    
    y = df[target]
    
    return X, y, [clean_feature_names(col) for col in markets.columns]

def train_and_evaluate_models(X, y, commodity, price_type='min'):
    """Model training with robust feature handling"""
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Initialize models (using only those that handle features well)
    models = {
        'RandomForest': RandomForestRegressor(n_estimators=200, random_state=42),
        'CatBoost': CatBoostRegressor(iterations=200, verbose=0, random_state=42),
        'XGBoost': XGBRegressor(n_estimators=200, random_state=42),
        'SVR': SVR(kernel='rbf', C=1.0, epsilon=0.1)
    }
    
    # Scale data for SVR
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    best_model = None
    best_score = float('inf')
    best_model_name = ""
    model_performance = {}
    model_confidence = {}
    
    # Train and evaluate each model
    for name, model in models.items():
        try:
            if name == 'SVR':
                model.fit(X_train_scaled, y_train)
                y_pred = model.predict(X_test_scaled)
                confidence = 0
            else:
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
                
                # Calculate confidence for tree-based models
                if hasattr(model, 'estimators_'):
                    preds = np.array([tree.predict(X_test) for tree in model.estimators_])
                    confidence = np.std(preds, axis=0).mean()
                else:
                    confidence = 0
            
            score = mean_squared_error(y_test, y_pred)
            model_performance[name] = score
            model_confidence[name] = confidence
            
            if score < best_score:
                best_score = score
                best_model = model
                best_model_name = name
                
        except Exception as e:
            print(f"Error with {name} for {commodity} {price_type} price: {str(e)}")
            continue
    
    print(f"\nBest model for {commodity} {price_type} price: {best_model_name} (RMSE: {np.sqrt(best_score):.2f})")
    
    # Save the best model
    os.makedirs('models', exist_ok=True)
    model_filename = f'models/{commodity}_{price_type}_model.pkl'
    joblib.dump(best_model, model_filename)
    
    # Save scaler if best model is SVR
    if best_model_name == 'SVR':
        joblib.dump(scaler, f'models/{commodity}_{price_type}_scaler.pkl')
    
    # Save model metadata
    metadata = {
        'training_date': datetime.now().strftime('%Y-%m-%d'),
        'best_score': best_score,
        'features': X.columns.tolist(),
        'model_type': best_model_name
    }
    joblib.dump(metadata, f'models/{commodity}_{price_type}_metadata.pkl')
    
    return best_model, best_model_name, model_confidence.get(best_model_name, 0)

def check_model_age(commodity, price_type):
    """Check if model needs retraining based on age"""
    metadata_path = f'models/{commodity}_{price_type}_metadata.pkl'
    if os.path.exists(metadata_path):
        metadata = joblib.load(metadata_path)
        training_date = datetime.strptime(metadata['training_date'], '%Y-%m-%d')
        model_age = (datetime.now() - training_date).days
        return model_age > 30  # Retrain if older than 30 days
    return True  # If no metadata, assume needs training

def predict_prices(commodity, date_str):
    """Robust prediction with feature alignment"""
    try:
        # Load data for feature preparation
        df = load_and_preprocess(DATASETS[commodity])
        if df is None or df.empty:
            return None, None, None, None
        
        # Check if models need retraining
        needs_retrain_min = check_model_age(commodity, 'min')
        needs_retrain_max = check_model_age(commodity, 'max')
        
        X_min, _, market_columns = prepare_features(df, 'Minimum Price(Rs./Quintal)')
        X_max, _, _ = prepare_features(df, 'Maximum Price(Rs./Quintal)')
        
        # Train or load min price model
        min_model_path = f'models/{commodity}_min_model.pkl'
        
        if needs_retrain_min or not os.path.exists(min_model_path):
            print(f"Training or retraining {commodity} min price model...")
            min_model, min_model_name, min_confidence = train_and_evaluate_models(
                X_min, df['Minimum Price(Rs./Quintal)'], commodity, 'min'
            )
        else:
            min_model = joblib.load(min_model_path)
            min_model_name = joblib.load(min_model_path).__class__.__name__
            
            # Load confidence from metadata
            metadata_path = f'models/{commodity}_min_metadata.pkl'
            if os.path.exists(metadata_path):
                metadata = joblib.load(metadata_path)
                min_confidence = metadata.get('confidence', 0)
            else:
                min_confidence = 0
        
        # Train or load max price model
        max_model_path = f'models/{commodity}_max_model.pkl'
        
        if needs_retrain_max or not os.path.exists(max_model_path):
            print(f"Training or retraining {commodity} max price model...")
            max_model, max_model_name, max_confidence = train_and_evaluate_models(
                X_max, df['Maximum Price(Rs./Quintal)'], commodity, 'max'
            )
        else:
            max_model = joblib.load(max_model_path)
            max_model_name = joblib.load(max_model_path).__class__.__name__
            
            # Load confidence from metadata
            metadata_path = f'models/{commodity}_max_metadata.pkl'
            if os.path.exists(metadata_path):
                metadata = joblib.load(metadata_path)
                max_confidence = metadata.get('confidence', 0)
            else:
                max_confidence = 0
        
        # Prepare input features
        input_date = parse_date(date_str)
        if pd.isna(input_date):
            raise ValueError("Invalid date format")
        
        days = (input_date - df['Arrival Date'].min()).days
        day_of_week = input_date.weekday()
        day_of_month = input_date.day
        month = input_date.month
        year = input_date.year
        
        # Handle market features
        features = {
            'Days': days,
            'Day_of_week': day_of_week,
            'Day_of_month': day_of_month,
            'Month': month,
            'Year': year
        }
        
        # Add market features if available
        if 'Market' in df.columns:
            most_common_market = df['Market'].mode()[0]
            for col in market_columns:
                features[col] = 1 if col == f'market_{most_common_market}' else 0
        
        # Add other features consistently
        if 'Arrivals_Tonnes' in X_min.columns:
            features['Arrivals_Tonnes'] = df['Arrivals_Tonnes'].iloc[-1] if 'Arrivals_Tonnes' in df.columns else 0
        
        if '7_day_avg' in X_min.columns:
            features['7_day_avg'] = df['Minimum Price(Rs./Quintal)'].rolling(7).mean().iloc[-1]
        
        # Create input DataFrame with exact same columns as training data
        input_df = pd.DataFrame(columns=X_min.columns)
        for col in X_min.columns:
            if col in features:
                input_df[col] = [features[col]]
            else:
                input_df[col] = [0]  # Fill missing features with 0
        
        # Make min price prediction
        if min_model_name == 'SVR':
            min_scaler = joblib.load(f'models/{commodity}_min_scaler.pkl')
            min_input_data = min_scaler.transform(input_df)
            min_prediction = min_model.predict(min_input_data)[0]
        else:
            min_prediction = min_model.predict(input_df)[0]
        
        # Make max price prediction
        if max_model_name == 'SVR':
            max_scaler = joblib.load(f'models/{commodity}_max_scaler.pkl')
            max_input_data = max_scaler.transform(input_df)
            max_prediction = max_model.predict(max_input_data)[0]
        else:
            max_prediction = max_model.predict(input_df)[0]
        
        # Get recent price range
        recent_days = 30
        if len(df) >= recent_days:
            recent = df.set_index('Arrival Date').last(f'{recent_days}D')
            min_range = (recent['Minimum Price(Rs./Quintal)'].min(), recent['Minimum Price(Rs./Quintal)'].max())
            max_range = (recent['Maximum Price(Rs./Quintal)'].min(), recent['Maximum Price(Rs./Quintal)'].max())
        else:
            min_range = (df['Minimum Price(Rs./Quintal)'].min(), df['Minimum Price(Rs./Quintal)'].max())
            max_range = (df['Maximum Price(Rs./Quintal)'].min(), df['Maximum Price(Rs./Quintal)'].max())
        
        return (
            round(float(min_prediction), 2), 
            round(float(max_prediction), 2),
            (round(float(min_confidence), 2), round(float(max_confidence), 2)),
            (min_range, max_range)
        )
    
    except Exception as e:
        print(f"Error predicting prices for {commodity}: {str(e)}")
        return None, None, None, None

@app.route('/predict', methods=['GET'])
def predict():
    """API endpoint for price prediction"""
    commodity = request.args.get('commodity')
    date_str = request.args.get('date')
    
    if not commodity or not date_str:
        return jsonify({'error': 'Both commodity and date parameters are required'}), 400
    
    if commodity not in DATASETS:
        return jsonify({'error': f'Invalid commodity. Available options: {", ".join(DATASETS.keys())}'}), 400
    
    try:
        min_price, max_price, confidences, ranges = predict_prices(commodity, date_str)
        if min_price is None or max_price is None:
            return jsonify({'error': 'Prediction failed'}), 500
        
        min_conf, max_conf = confidences
        min_range, max_range = ranges
        
        response = {
            'commodity': commodity,
            'date': date_str,
            'predictions': {
                'minimum_price': min_price,
                'maximum_price': max_price,
                'confidence': {
                    'minimum': min_conf,
                    'maximum': max_conf
                }
            },
            'recent_range': {
                'minimum': {
                    'low': min_range[0],
                    'high': min_range[1]
                },
                'maximum': {
                    'low': max_range[0],
                    'high': max_range[1]
                }
            },
            'units': 'Rs./Quintal'
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/commodities', methods=['GET'])
def list_commodities():
    """API endpoint to list available commodities"""
    return jsonify({
        'available_commodities': list(DATASETS.keys())
    })

if __name__ == '__main__':
    app.run(debug=True)