import { Viewer, Worker, ScrollMode } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { Paper, Box, Typography } from "@mui/material";

type PDFViewerProps = { 
  filename: string | null;
  onPageChange?: (page: number) => void;
};

export default function PDFViewer({ filename, onPageChange }: PDFViewerProps) {
  if (!filename) {
    return (
      <Paper elevation={4} sx={{ p: 2, minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography color="text.secondary">No PDF selected</Typography>
      </Paper>
    );
  }

  const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/${filename}`;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
      <Box sx={{ width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: 1 }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance]}
            scrollMode={ScrollMode.Vertical}
            defaultScale={1}
            theme="light"
            onPageChange={(e) => onPageChange?.(e.currentPage + 1)}
          />
        </Worker>
      </Box>
  );
}
