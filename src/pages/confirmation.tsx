import { useRouter } from "next/router";

export default function ConfirmationPage() {
  const router = useRouter();
  const { ids, weeks } = router.query;

  const idList = typeof ids === "string" ? ids.split(",") : [];
  const weekList = typeof weeks === "string" ? weeks.split(",") : [];

  return (
    <div
      style={{
        direction: "ltr",
        maxWidth: 600,
        margin: "0 auto",
        fontFamily: "Arial",
        background: "#f1f1f1",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        marginTop: 50,
      }}
    >
      <h2 style={{ textAlign: "center", color: "green" }}>
        Order submitted successfully!
      </h2>
      <p>Please save your order IDs for pickup:</p>

      <ul>
        {idList.map((id, i) => (
          <li key={i}>
            <strong>{weekList[i]}:</strong> {id}
          </li>
        ))}
      </ul>

      <p style={{ marginTop: 20 }}>
        If you'd like to modify your order, please contact us at:{" "}
        <a href="mailto:example.com.uk">example.com.uk</a>
      </p>
    </div>
  );
}
