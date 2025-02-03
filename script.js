document.addEventListener('DOMContentLoaded', function() {
    Pagsmile.setPublishableKey({
        app_id: "16977425781401932",
        public_key: "Pagsmile_sk_9ad2961bc27b8d9ae67c493aa2b38271139b3df571fc592af2612b401180d53b",
        env: "sandbox", // Change to "prod" in live environment
        region_code: "BRA", //BRA for Brazil, EUP for Europe, USA for Noth America
        prepay_id: "cjExNDB5dUZhK1lkLzgzMjhSUkpFdk13YVloaEZ5T09OVG5WdEcxdmNIaz0=-06168a6c",
        fields: {
            card_name: {
                id_selector: "card holder name",
            },
            card_number: {
                id_selector: "card number",
            },
            expiration_month: {
                id_selector: "exp month",
            },
            expiration_year: {
                id_selector: "exp year",
            },
            cvv: {
                id_selector: "card cvv",
            },
        }
    }).then((clientInstance) => {
        // successfully initiated
        document.getElementById("submit-pay").addEventListener("click", function (e) {
            e.preventDefault();
            handlePayment(clientInstance);
        });
    }).catch((error) => {
        console.error("Error initializing Pagsmile: ", error);
    });
});

function handlePayment(clientInstance) {
    const cardName = document.getElementById('card-name').value;
    const cardNumber = document.getElementById('card-number').value;
    const expMonth = document.getElementById('exp-month').value;
    const expYear = document.getElementById('exp-year').value;
    const cvv = document.getElementById('card-cvv').value;

    if (!cardName || typeof cardName !== 'string' || cardName.trim() === '') {
        console.error('Hey! Invalid card name. Name must be a non-empty string');
        return;
    }
    console.log(cardName)
    clientInstance.createOrder().then((res) => {
        console.log("res: ", res); 
        const timestamp = Date.now().toString();
        const requestBody = {
            app_id: '16977425781401932',
            out_trade_no: timestamp,
            order_currency: 'BRL',
            method: 'CreditCard',
            card_name: cardName,
            card_number: cardNumber,
            exp_month: expMonth,
            exp_year: expYear,
            cvv: cvv
        };

        // Add your axios request here to send requestBody to your server
    }).catch((error) => {
        console.error("Error creating order: ", error);
    });
}