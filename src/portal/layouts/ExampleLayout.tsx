import React, { ReactNode } from "react";
import { Paper, Typography, Box } from "@mui/material";
import styled from "styled-components";

interface ExampleLayoutProps {
  title: string;
  description: ReactNode;
  features?: string[];
  githubUrl?: string; // Optional: Link to source
  children: ReactNode;
  actions?: ReactNode; // Buttons like "Update Graph"
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
`;

const ContentPanel = styled.div`
  flex: 0 0 auto;
  padding: 24px 24px 0 24px;
  margin-bottom: 24px;
`;

const GraphPanel = styled(Paper)`
  flex: 1 1 auto;
  min-height: 500px; /* Ensure at least some height */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  border-top: 1px solid #e0e0e0;
  border-radius: 0; /* Remove rounded corners for full bleed feel if desired, or keep specific styling */
`;

// Helper to keep the toolbar inside the graph card
const GraphToolbar = styled.div`
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const GraphContent = styled.div`
  flex: 1;
  position: relative;
  background: white;
  
  /* Ensure children (the graph) take full size */
  & > div {
    height: 100%;
    width: 100%;
  }
`;

export const ExampleLayout: React.FC<ExampleLayoutProps> = ({
  title,
  description,
  children,
  actions,
}) => {
  return (
    <LayoutContainer>
      <ContentPanel>
        <Typography variant="h4" gutterBottom style={{ fontWeight: 600, color: '#2c3e50' }}>
          {title}
        </Typography>
        <Box color="text.secondary" style={{ maxWidth: '800px', marginBottom: '16px' }}>
          {description}
        </Box>
      </ContentPanel>

      <GraphPanel elevation={3}>
        {actions && <GraphToolbar>{actions}</GraphToolbar>}
        <GraphContent>{children}</GraphContent>
      </GraphPanel>
    </LayoutContainer>
  );
};
