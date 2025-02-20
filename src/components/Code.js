
import React, { useState } from 'react';
import { Card, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Highlight, Prism } from 'prism-react-renderer';

import themeStyle from "../assets/syntax-themes/ghcolors.json";

export default function Code(props){
  const { code = "", language = "jsx" } = props;
  const [copied, setCopied] = useState(false);

  const handleCopy = async() => {
    try{
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }catch(error){
      console.log("Error:", error);
    }
    
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Simple tooltip
    </Tooltip>
  );

  const CodeStyling = ({ className, style, tokens, getLineProps, getTokenProps }) => (
    <Card className="position-relative pe-8 mb-2">
      <Card.Body>
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => <span {...getTokenProps({ token, key })} />)}
            </div>
          ))}
        </pre>

        {copied ? <span className="text-success copy-code-text">Copied</span> : null}
        <OverlayTrigger
          trigger={['hover', 'focus']}
          placement="top"
          overlay={<Tooltip>Copy to clipboard</Tooltip>}
        >
          <Button size="sm" variant="primary" className="copy-code-button" onClick={handleCopy}>Copy</Button>
        </OverlayTrigger>
      </Card.Body>
    </Card>
  );

  return (
    <Highlight Prism={Prism} code={code} language={language} theme={themeStyle}>
      {CodeStyling}
    </Highlight>
  );
};

