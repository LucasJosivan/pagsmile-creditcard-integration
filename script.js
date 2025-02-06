document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("submit-pay").addEventListener("click", (event) => {
        event.preventDefault();
        processPayment();
    });
});

/**
 * Process the payment by handling the payment data and sending card info.
 */
async function processPayment() {
    try {
        const paymentData = await handlePayment();
        const prepayId = paymentData.prepay_id;

        if (!prepayId) {
            console.error('prepay_id is undefined');
            return;
        }

        // Call the sendCardInfo function with the necessary data
        sendCardInfo(prepayId);
    } catch (error) {
        console.error('Error processing payment:', error);
    }
}

/**
 * Handle the payment by creating the request body and returning the payment data.
 */
async function handlePayment() {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const requestBody = {
        app_id: '16977425781401932',
        method: 'CreditCard',
        out_trade_no: Math.random().toString(36).substring(2, 18),
        notify_url: 'https://merchant.com/notify',
        timestamp: timestamp,
        subject: 'Subject Test',
        order_amount: 10,
        order_currency: 'BRL',
        content: 'Content Test',
        buyer_id: 'buyer_id1234',
        version: '2.0',
        trade_type: 'API',
        customer: {
            name: 'Test User Name',
            email: 'gabrz000@gmail.com',
            phone: '5511987654321',
            identify: {
                type: 'CPF',
                number: '11032341882'
            }
        },
        address: {
            zip_code: '01001000'
        }
    };

    try {
        const response = await axios.post('https://gateway-test.pagsmile.com/trade/create', requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic MTY5Nzc0MjU3ODE0MDE5MzI6UGFnc21pbGVfc2tfOWFkMjk2MWJjMjdiOGQ5YWU2N2M0OTNhYTJiMzgyNzExMzliM2RmNTcxZmM1OTJhZjI2MTJiNDAxMTgwZDUzYg=='
            }
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function sendCardInfo(prepay_id) {
    Pagsmile.setPublishableKey({
        app_id: "16977425781401932",
        public_key: "Pagsmile_sk_9ad2961bc27b8d9ae67c493aa2b38271139b3df571fc592af2612b401180d53b",
        env: "sandbox", // Change to "prod" in live environment
        region_code: "BRA", //BRA for Brazil, EUP for Europe, USA for Noth America
        prepay_id: prepay_id,
        fields: {
            card_name: {
                id_selector: "card-name",
            },
            card_number: {
                id_selector: "card-number",
            },
            expiration_month: {
                id_selector: "exp-month",
            },
            expiration_year: {
                id_selector: "exp-year",
            },
            cvv: {
                id_selector: "card-cvv",
            }
        }
    }).then((clientInstance) => {
        // successfully initiated
        clientInstance
        .createOrder()
        .then((res) => {
          console.log("res: ", res); 
          // {
          //   status: "success",
          //   query: true,       // query transaction status through API endpoint /trade/query
          // }
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    }).catch((error) => {
        console.error("Error initializing Pagsmile: ", error);
    });
}