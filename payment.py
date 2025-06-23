from flask import Flask, request, jsonify
import razorpay
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from React frontend

# Razorpay API credentials
razorpay_client = razorpay.Client(auth=(
    # ✅ Your Razorpay Key ID,
    # ✅ Your Razorpay Secret
))

@app.route('/create-order', methods=['POST'])
def create_order():
    try:
        data = request.get_json()

        # Validate incoming data
        if 'amount' not in data or 'upiId' not in data:
            return jsonify({'error': 'amount and upiId are required'}), 400

        amount = int(data['amount'])*100 # Convert rupees to paise
        upi_id = data['upiId']

        # Create Razorpay order
        order = razorpay_client.order.create({
            'amount': amount,
            'currency': 'INR',
            'payment_capture': 1,
            'notes': {
                'upi_id': upi_id
            }
        })

        return jsonify({
            'order_id': order['id'],
            'amount': amount
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ✅ Main runner
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000, debug=True)
