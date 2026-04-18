import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Invoice.css";

function formatCurrency(value) {
    return Number(value || 0).toLocaleString("en-IN");
}

function formatDate(value) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function Invoice({ order }) {
    const invoiceRef = useRef(null);
    const items = order?.items || [];

    const downloadInvoice = async () => {
        if (!invoiceRef.current) return;

        const canvas = await html2canvas(invoiceRef.current, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#f7f4ee",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        pdf.save(`invoice_${order?.orderId || "order"}.pdf`);
    };

    return (
        <>
            <button className="invoice-btn" onClick={downloadInvoice} type="button">
                📄 Invoice
            </button>

            <div className="invoice-canvas-host" aria-hidden="true">
                <div ref={invoiceRef} className="invoice-container">
                    <div className="invoice-topbar" />

                    <div className="invoice-header">
                        <div className="invoice-brand">
                            <div className="invoice-brand__badge">IB</div>
                            <div>
                                <h2>InstaBuy</h2>
                                <p>Smart shopping, fast delivery</p>
                            </div>
                        </div>

                        <div className="invoice-title">
                            <span className="invoice-chip">Tax Invoice</span>
                            <h1>INVOICE</h1>
                            <p>Invoice #: {order?.orderId}</p>
                            <p>Date: {formatDate(order?.orderDate)}</p>
                        </div>
                    </div>

                    <div className="invoice-grid">
                        <div className="invoice-card">
                            <span className="invoice-label">Billed To</span>
                            <h4>{order?.shippingAddress || "Address not available"}</h4>
                            <p>Phone: {order?.phone || "N/A"}</p>
                        </div>

                        <div className="invoice-card">
                            <span className="invoice-label">Payment Details</span>
                            <h4>{order?.paymentStatus || "N/A"}</h4>
                            <p>Order Status: {order?.orderStatus || "N/A"}</p>
                        </div>
                    </div>

                    <div className="invoice-table-wrap">
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={item.orderItemId || item.productId || index}>
                                        <td>{index + 1}</td>

                                        {/* 🔥 CHANGE START */}
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                                                {item.imageUrl ? (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.productName}
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            objectFit: "cover",
                                                            borderRadius: "6px"
                                                        }}
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: "18px" }}>📦</span>
                                                )}

                                                <span>
                                                    {item.productName || `Product #${item.productId}`}
                                                </span>

                                            </div>
                                        </td>
                                        {/* 🔥 CHANGE END */}

                                        <td>{item.quantity}</td>
                                        <td>Rs. {formatCurrency(item.price)}</td>
                                        <td>Rs. {formatCurrency(item.totalPrice || item.quantity * item.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="invoice-summary">
                        <div className="invoice-summary__note">
                            <span className="invoice-label">Note</span>
                            <p>Thank you for shopping with InstaBuy. Please keep this invoice for your records.</p>
                        </div>

                        <div className="invoice-total-card">
                            <span className="invoice-total-card__label">Grand Total</span>
                            <h3>Rs. {formatCurrency(order?.totalAmount)}</h3>
                        </div>
                    </div>

                    <div className="invoice-footer">
                        <div>
                            <span className="invoice-label">Issued By</span>
                            <p>InstaBuy Pvt. Ltd.</p>
                        </div>
                        <div className="invoice-signature">
                            <span className="invoice-label">Authorized Signatory</span>
                            <p>InstaBuy Accounts Team</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Invoice;
