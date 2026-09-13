import Razorpay from "razorpay";

// Razorpay ka ek "instance" bana rahe hain — is object ke through hi Razorpay se
// baat hogi (order banana, verify karna, etc.). key_id aur key_secret .env.local
// se aa rahe hain (kabhi hardcode nahi karte, security ke liye)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// when tha user clicks "Pay Now" on the frontend, this will we called
export async function POST(req) {
  try {
    // frontend se amount le rahe hain (rupees mein, jaise 1499)
    const { amount } = await req.json();

    // Razorpay ko order banane ko bol rahe hain
    const order = await razorpay.orders.create({
      // Razorpay paise mein amount leta hai, isliye 100 se multiply kar rahe hain
      // (₹1499 → 149900 paise)
      amount: amount * 100,
      currency: "INR",
    });

    // Razorpay se mila order (jisme uski apni order ID hai) frontend ko bhej rahe hain
    return Response.json({ order }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "failed to create payment order" },
      { status: 500 },
    );
  }
}
