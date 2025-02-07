# Credit Card
How to use CreditCard to submit a payin in Brazil. This guide provides step-by-step instructions for integrating Pagsmile into your website for seamless payment processing. Pagsmile offers robust features and security measures to ensure smooth transactions for your customers.

## Creating HTML and JS struct
### Prerequisites
1. **Pagsmile Account**: Ensure you have signed up for a Pagsmile account. You will need your `app_id` and `public_key` provided by Pagsmile.
2. **Environment**: Access to your website's HTML and JavaScript files for integration.

### Step 1: HTML Form Structure
Below is the basic HTML code to create the credit card input fields.
> ALERT: Don't change the id values
```HTML
  <div>    
    <ul>
      <li>
        <label>Card holder name:</label>
        <input type="text" id="card-name" placeholder="Card holder" autocomplete="off" />
      </li>
      <li>
        <label>Credit card number:</label>
        <input type="text" id="card-number" placeholder="XXXX XXXX XXXX XXXX" />
      </li>
      <li>
        <label>Expiration year:</label>
        <input id="exp-year" type="text" placeholder="2028" autocomplete="off" />
      </li>
      <li>
        <label>Expiration month:</label>
        <input id="exp-month" type="text" placeholder="12" autocomplete="off"/>
      </li>
      <li>
        <label>Security code:</label>
        <input id="card-cvv" type="text" placeholder="123" autocomplete="off" />
      </li>
   </ul>
   <input type="button" id="submit-pay" value="Pay!" />
 </div>  
```
### Step 2: Include Pagsmile Script
Add the Pagsmile JavaScript library to the `<head>` section of your HTML file. This script is necessary to initialize and interact with the Pagsmile API.
```HTML
<head>
  <!-- Other head content -->
  <script src="https://res.pagsmile.com/lib/js/pagsmile.min.js"></script>
</head>
```

## Creating API request
### Step 3: Creating the transaction
Before retrieving credit card data from the form, create a transaction via API by sending the required data below. This transaction will return a `prepay_id` code, which will be used in the script to complete the transaction. Get the `prepay_id` from the API response. Each transaction should create a unique `prepay_id`.
> POST https://gateway-test.pagsmile.com/trade/create

This endpoint allows you to submit a payin by CreditCard in Brazil in the test enviroment. Check all the enviroments [clicking here](https://docs.pagsmile.com/payin/environments).

#### Headers
| Name | Type | Description |
|---|---|---|
|Content-Type*|string|application/json; chartset=UTF-8|
|Authorization*|string|Basic Base($app_id:$security_key)|

#### Request Body
|Name | Type | Description |
|---|---|---|
|app_id*|string|created app's id at dashboard - Max. 32 chars -|
|method*|string|Fixed value: CreditCard|
|out_trade_no*|string|ID given by the merchant in their system - Max. 64 chars -|
|notify_url*|string|Where Pagsmile will send notification to|
|timestamp*|string|yyyy-MM-dd HH:mm:ss - Max. 19 chars -|
|subject*|string|payment reason or item title - Max. 128 chars -|
|order_amount*|string|payment amount - 0.01~50,000 BRL -|
|order_currency*|string|Fixed value: BRL|
|content|string|payment reason detail or item detail - Max. 255 chars -|
|buyer_id*|string|merchant user's id|
|version*|string|Fixed value: 2.0|
|trade_type*|string|Fixed value: API|
|timeout_express|string|m(minutes), h(hours), d(days), c(always end in current day). Used to control the expiration time of submitting an order (from initial to processing). (90m in default, max 15d)|
|customer.name*|string|User's name|
|customer.email*|string|User's email|
|customer.phone*|string|User's phone|
|customer.identify.type*|string|User's identification type - CPF or CNPJ -|
|customer.identify.number*|string|User's identification number - 11 digits if CPF or 14 digits if CNPJ -|
|address.zip_code*|string|billing zip code|

#### Response Body
##### 200 submit successfully
```json
{
  "code": "10000",
  "msg": "Success",
  "out_trade_no": "out***300",
  "trade_no": "20240***34",
  "prepay_id": "UloyV0l3NFFyW***DTT0=-645a8F4c"
}
```

##### 400 duplicate out_trade_no
```json
{
    "code": "40002",
    "msg": "Business Failed",
    "sub_code": "duplicate-out_trade_no",
    "sub_msg": "out_trade_no is duplicate"
}
```

#### Request example
```sh
curl --location --request POST 'https://gateway-test.pagsmile.com/trade/create' \
--header 'Authorization: Basic YOUR_BASE64_ENCODED_AUTH' \
--header 'Content-Type: application/json' \
--data-raw '{
  "app_id": "YOUR_APP_ID",
  "method": "CreditCard",
  "out_trade_no": "YOUR_UNIQUE_TRADE_NO",
  "notify_url": "YOUR_NOTIFY_URL",
  "timestamp": "2024-07-04 18:50:42",
  "subject": "Payment for Order #1234",
  "order_amount": "100.00",
  "order_currency": "BRL",
  "content": "Detailed description of the payment",
  "buyer_id": "buyer123",
  "version": "2.0",
  "trade_type": "API",
  "timeout_express": "90m",
  "customer": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "5511999999999",
    "identify": {
      "type": "CPF",
      "number": "12345678901"
    }
  },
  "address": {
    "zip_code": "01001000"
  }
}'
```
> **Note:** YOUR_APP_ID is pagsmile's test app id for sandbox, and YOUR_UNIQUE_TRADE_NO is authorization token associated with the test app id. 

> **Alert:** Please use your own app_id and generate your own authorization token when testing.

## Submitting card data
### Step 4: Handle Payment Form Submission
Use createOrder method of returned clientinstance and initialize payment upon user submission. Check Brazil, Mexico, Peru, Ecuador, Egypt, Saudi Arabia, Kuwait, Qatar, Oman, UAE,  Europe, or North America. Once you get *status: "success"* query transaction status with help of related backend endpoints.

#### setPublishableKey Optional Parameters
**pre_auth:** ``boolean`` (optional). Whether pre-authorization is enabled. When set to ``true``, pre-authorization is enabled for payments. Defaults to ``false``.

**form_id:** ``string`` (conditional, required for Mexico). The ID of the form element to be used for payment processing. This parameter is required for transactions in Mexico.

#### createOrder Optional Parameters
**installments:** ``object`` (optional). This parameter should be provided if there is installment information is returned by [Installment Detail Query](https://docs.pagsmile.com/payin/tools/installment-detail-query) endpoint.

**address:** ``Object`` (optional). An optional address object that specifies the country associated with the payment.

**country_code:** ``string`` (optional). A 3-letter ISO country code that specifies the country associated with the payment (e.g., ``SWE`` for Sweden). If not provided, this field will be omitted.

##### createOrder code example
```javascript
createOrder({ 
   installments: { stage: 3 }, //stage support 1 ~ 12
   address: { country_code: "SWE"} 
}) 
```
#### setPublishableKey code example
```javascript
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
```

### Step 5: Testing and Deployment
1. **Sandbox Mode:** During development and testing, use ``env: "sandbox"``. Verify that payments process correctly and error handling works as expected.
2. **Production Mode:** Before deploying to production, change the ``env`` setting to ``prod``.

## Full code example
You can access the full code [clicking here](https://github.com/LucasJosivan/pagsmile-creditcard-integration).