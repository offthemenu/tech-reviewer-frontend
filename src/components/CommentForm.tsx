import { TextField, Stack, Button } from '@mui/material';
import { useState } from 'react';
import api from '../services/api';

interface CommentFormProps {
  context: {
    project: string;
    device: string;
    pageName: string;
    pagePath: string;
    filename: string;
  };
  onSuccess?: () => void;
}

export default function CommentForm({ context, onSuccess }: CommentFormProps) {
  const { project, device, pageName, pagePath, filename } = context;
  const [uiComponent, setUiComponent] = useState('');
  const [text, setText] = useState('');

  const submit = async () => {
    console.log("👋 submit called", { project, device, pageName, pagePath, uiComponent, text, filename });
    if (!text.trim()) return;
    try {
      await api.post('/add_comment', {
        project,
        device,
        page_name: pageName,
        page_path: pagePath,       
        ui_component: uiComponent.toUpperCase(),
        comment: text,
        filename,
      });
      setText('');
      setUiComponent('');
      onSuccess?.();
    } catch (err) {
      console.error("Failed to submit comment", err);
    }
  };

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      <TextField
        label="UI Component"
        placeholder="e.g. BUTTON, TEXT"
        value={uiComponent}
        onChange={(e) => setUiComponent(e.target.value)}
        size="small"
        fullWidth
      />

      <TextField
        label="Review Comment"
        placeholder="Add technical review comment for this component"
        value={text}
        onChange={(e) => setText(e.target.value)}
        multiline
        minRows={4}
        fullWidth
      />

      <Button
        variant="contained"
        color="primary"
        disabled={!text.trim() || !uiComponent.trim()}
        onClick={submit}
        fullWidth
      >
        Add Comment
      </Button>
    </Stack>
  );
}
