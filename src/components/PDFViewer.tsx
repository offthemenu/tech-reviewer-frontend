import { Viewer, Worker, ScrollMode, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

type PDFViewerProps = { 
  filename: string | null;
  onPageChange?: (page: number) => void
};

export default function PDFViewer({ filename, onPageChange }: PDFViewerProps) {
  if (!filename) return <p className="text-gray-500">No PDF selected</p>;

  const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/${filename}`;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="flex-grow w-full aspect-[16/9] overflow-hidden border rounded shadow bg-white">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          scrollMode={ScrollMode.Vertical}
          defaultScale={SpecialZoomLevel.PageWidth}
          theme="light"
          onPageChange={(e) => onPageChange?.(e.currentPage + 1)}
        />
      </Worker>
    </div>
  );
}
