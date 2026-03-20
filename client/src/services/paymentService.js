import api from './api.js'

export const paymentService = {
  createOrder:   (trackId) => api.post('/payments/order', { trackId }),
  verifyPayment: (data)    => api.post('/payments/verify', data),
}

export const loadRazorpay = () =>
  new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const script    = document.createElement('script')
    script.src      = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload   = () => resolve(true)
    script.onerror  = () => resolve(false)
    document.body.appendChild(script)
  })

export const initiatePayment = async ({ trackId, user, onSuccess, onFailure }) => {
  const loaded = await loadRazorpay()
  if (!loaded) return onFailure?.('Razorpay failed to load')

  const order = await paymentService.createOrder(trackId)

  const options = {
    key:      import.meta.env.VITE_RAZORPAY_KEY,
    amount:   order.amount,
    currency: order.currency,
    name:     'PlacePrep',
    description: order.trackTitle,
    order_id: order.orderId,
    prefill:  { name: user.name, email: user.email },
    theme:    { color: '#6366f1' },
    handler:  async (response) => {
      try {
        await paymentService.verifyPayment({
          razorpayOrderId:  response.razorpay_order_id,
          razorpayPaymentId:response.razorpay_payment_id,
          razorpaySignature:response.razorpay_signature,
          trackId,
        })
        onSuccess?.()
      } catch (err) {
        onFailure?.(err.message)
      }
    },
  }

  const rzp = new window.Razorpay(options)
  rzp.open()
}