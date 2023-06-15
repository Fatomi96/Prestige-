import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};

function read() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("");

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      setOpen(false);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => setOpen(true)}>Scan QR Code</button>
      {open && (
        <QrReader
          delay={300}
          onError={(err) => console.error(err)}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
      )}
      {result && <p>Result: {result}</p>}
    </div>
  );
}

export default read;