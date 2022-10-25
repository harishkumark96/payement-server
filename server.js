const express =  require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config()
app.use(express.static("public"));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors({origin:true, credentials:true}));

const stripe = require('stripe')(process.env.key);

app.post('/checkout',async (req,res,next)=>{
  try {
    const session = await stripe.checkout.sessions.create({
    // payment_method_types: ['card'],
    shipping_address_collection: {
    allowed_countries: ['IN'],
    },
        shipping_options: [
        {
            shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
                amount: 0,
                currency: 'inr',
            },
            display_name: 'Free shipping',
            // Delivers between 5-7 business days
            delivery_estimate: {
                minimum: {
                unit: 'business_day',
                value: 5,
                },
                maximum: {
                unit: 'business_day',
                value: 7,
                },
            }
            }
        },
        {
            shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
                amount: 1500,
                currency: 'inr',
            },
            display_name: 'Next day air',
            // Delivers in exactly 1 business day
            delivery_estimate: {
                minimum: {
                unit: 'business_day',
                value: 1,
                },
                maximum: {
                unit: 'business_day',
                value: 1,
                },
            }
            }
        },
        ],
       line_items:  req.body.items.map((item) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
            images: [item.product]
          },
          unit_amount: item.price * 100 * 82,
        },
        quantity: item.quantity,
      })),
       mode: "payment",
       success_url: "https://ecommerce-server16.herokuapp.com/success.html",
       cancel_url: "https://ecommerce-server16.herokuapp.com/cancel.html",
    });

    res.status(200).json(session);
} catch (error) {
    next(error);
}
})

app.get('/',(req,res)=>{
  res.send('Ecommerce Backend Working perfectly')
})

app.listen(PORT, console.log(
  `Server started on port ${PORT}`));
























// try{
//   const session = await stripe.checkout.sessions.create({

//    line_items : req.body.items.map((item) =>( {
//      price_data: {
//        currency: 'INR',
//        product_data: {
//          name: item.name,
//          images:[item.product]
//        },
//        unit_amount: item.price *100,
//      },
//      quantity: item.quantity,
//    })),
//    mode: 'payment',
//    success_url: "http://localhost:3000/success.html",
//         cancel_url: "http://localhost:3000/cancel.html",
//   });
//   res.status(200).json(session)
// }catch(error){
// next(error)
// }
