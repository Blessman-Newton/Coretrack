import React from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  className?: string;
}

export const Barcode: React.FC<BarcodeProps> = ({
  value,
  width = 2,
  height = 40,
  displayValue = true,
  className,
}) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  React.useEffect(() => {
    if (!svgRef.current || !value) return;
    try {
      JsBarcode(svgRef.current, value, {
        format: 'CODE128',
        width,
        height,
        displayValue,
        fontSize: 12,
        margin: 0,
        textMargin: 2,
      });
    } catch (e) {
      // In case of invalid characters, fallback to a simple text rendering
      if (svgRef.current) {
        svgRef.current.innerHTML = '';
      }
    }
  }, [value, width, height, displayValue]);

  return (
    <svg ref={svgRef} className={className} />
  );
};