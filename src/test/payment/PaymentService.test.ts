import { PaymentDetails, PaymentMethod } from '../../app/payment/PaymentDetails';
import { PaymentService } from '../../app/payment/PaymentService';

describe('Payment Service', () => {
  const paymentAdapterMock = {
    processPayment: jest.fn(),
  };
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService(paymentAdapterMock);
  });

  test('should successfully process a valid payment', () => {
    // Arrange
    const mockPaymentDetails: PaymentDetails = {
      amount: 150,
      currency: 'usd',
      method: PaymentMethod.CreditCard,
      cardNumber: '123456789'
    };
    const mockProcessPaymentResponse = { status: 'success', transactionId: 'txn_1234567890' };
    paymentAdapterMock.processPayment.mockImplementation(()=> mockProcessPaymentResponse);
    // Act
    const result = paymentService.makePayment(mockPaymentDetails);
    // Assert
    expect(result).toEqual("Payment successful. Transaction ID: txn_1234567890");
    expect(paymentAdapterMock.processPayment).toHaveBeenCalledWith(mockPaymentDetails);
  });

  test('should throw an error for payment failure', () => {
    // Arrange
    const mockPaymentDetails: PaymentDetails = {
      amount: 150,
      currency: 'usd',
      method: PaymentMethod.CreditCard,
      cardNumber: '123456789'
    };
    const mockProcessPaymentResponse = {status: 'failure'};
    paymentAdapterMock.processPayment.mockImplementation(()=> mockProcessPaymentResponse);
    // Act & Assert
    expect(() => paymentService.makePayment(mockPaymentDetails)).toThrow('Payment failed');
  });

  test('should throw an error for invalid payment amount', () => {
    // Arrange
    const mockPaymentDetails: PaymentDetails = {
      amount: -150,
      currency: 'usd',
      method: PaymentMethod.CreditCard,
      cardNumber: '123456789'
    };
    // Act & Assert
    expect(() => paymentService.makePayment(mockPaymentDetails)).toThrow('Invalid payment amount');
  });
});
