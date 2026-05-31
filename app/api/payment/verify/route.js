import crypto from "crypto";

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ error: "Missing payment details" }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Missing Razorpay secret key");
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return Response.json({ error: "Payment verification failed" }, { status: 400 });
    }

    return Response.json({ verified: true });
  } catch (err) {
    return Response.json(
      { error: err.message || "Unable to verify payment" },
      { status: 500 }
    );
  }
}
