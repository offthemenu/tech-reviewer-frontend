import { Box, Button, Typography, Input, Stack } from "@mui/material";
import { useState } from "react";
import api from "../services/api";

export default function PDFUpload({ onUpload }: { onUpload: (filename: string)  => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload_pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(`✅ Uploaded: ${res.data.filename}`);
      onUpload(res.data.filename);
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus("❌ Upload failed");
    }
  };

  return (
    <Box border={1} borderColor="grey.300" borderRadius={2} p={2}>
      <Typography variant="subtitle1" mb={1}>
        Upload PDF
      </Typography>
      <Stack direction="row" spacing={{ xs: 5, sm: 5, md: 5 }} justifyContent="center" alignItems="center" useFlexGap sx={{ mt: 2, flexWrap: "wrap" }}>
      <Input type="file" onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] || null)} />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpload}>
        Upload
      </Button>
      </Stack>
      {status && (
        <Typography variant="body2" mt={1}>
          {status}
        </Typography>
      )}
    </Box>
  );
}
