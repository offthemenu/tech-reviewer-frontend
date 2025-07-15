import {
  Paper, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Checkbox, 
  Typography, 
  Button, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Snackbar, 
  Alert
} from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../services/api';

type Comment = {
  id: number;
  project: string;
  device: string;
  page_number?: number;
  ui_component: string;
  comment: string;
  created_at: string;
  page_name: string;
  page_path: string;
};

type DialogAction = 'markdown' | 'delete' | null;

export default function CommentList({
  project,
  device,
  refreshFlag,
}: {
  project: string;
  device: string;
  refreshFlag: boolean;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<DialogAction>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchComments = () => {
    if (!project || !device) return;

    api
      .get('/comments', { params: { project, device } })
      .then((res: { data: Comment[] }) => {
        setComments(res.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchComments();
  }, [project, device, refreshFlag]);

  const toggle = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCopyMarkdown = () => {
    const header = `| Page No. | Page Name | Page Path | UI Component | Comment |\n| --- | --- | --- | --- | --- |\n`;
    const rows = comments
      .map(c => `| ${c.page_number ?? ''} | ${c.page_name} | ${c.page_path} | ${c.ui_component} | ${c.comment} |`)
      .join('\n');
    const markdown = header + rows;

    navigator.clipboard.writeText(markdown)
      .then(() => {
        setSnackbarOpen(true);
      })
      .catch((err) => console.error("Failed to copy markdown", err));
  };

  const handleDelete = async () => {
    for (const id of selectedIds) {
      await api.delete(`/comment/${id}`);
    }
    setComments((prev) => prev.filter((c) => !selectedIds.has(c.id)));
    setSelectedIds(new Set());
  };

  const handleDialogConfirm = () => {
    if (dialogAction === 'markdown') {
      handleCopyMarkdown();
    } else if (dialogAction === 'delete') {
      handleDelete();
    }
    setDialogOpen(false);
  };

  return (
    <>
      <Paper id="comment-table" elevation={4} sx={{ mt: 6, p: 3, overflowX: 'auto' }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Technical Review Comments
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
              <TableCell padding="checkbox" />
              <TableCell>Page Number</TableCell>
              <TableCell>Page Name</TableCell>
              <TableCell>Page Path</TableCell>
              <TableCell>UI Component</TableCell>
              <TableCell>Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.has(c.id)}
                    onChange={() => toggle(c.id)}
                  />
                </TableCell>
                <TableCell>{c.page_number ?? "—"}</TableCell>
                <TableCell>{c.page_name}</TableCell>
                <TableCell>{c.page_path}</TableCell>
                <TableCell>{c.ui_component}</TableCell>
                <TableCell>{c.comment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selectedIds.size > 0 && (
          <Box mt={3} display="flex" alignItems="center">
            <Typography variant="body2">
              {selectedIds.size} item(s) selected
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setDialogAction('delete');
                setDialogOpen(true);
              }}
              sx={{ ml: 'auto', minWidth: 120 }}
            >
              Delete
            </Button>
          </Box>
        )}

        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            onClick={() => {
              setDialogAction('markdown');
              setDialogOpen(true);
            }}
            sx={{ minWidth: 160 }}
          >
            Copy as Markdown
          </Button>
        </Box>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {dialogAction === 'delete' ? 'Delete selected comments?' : 'Copy comments as Markdown?'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {dialogAction === 'delete'
              ? 'This action cannot be undone. Are you sure you want to delete the selected comment(s)?'
              : 'Copy the current comments as Markdown?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDialogConfirm}
            color={dialogAction === 'delete' ? 'error' : 'primary'}
            variant="contained"
          >
            {dialogAction === 'delete' ? 'Delete' : 'Copy'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Centered on screen
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          📋 Markdown copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}
