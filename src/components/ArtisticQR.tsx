import { useEffect, useRef, useState } from "react";
import QRCodeStyling, {
    Options,
    CornerSquareType,
    DotType,
    CornerDotType,
    DrawType,
    TypeNumber,
    ErrorCorrectionLevel,
    Mode,
    FileExtension
} from "qr-code-styling";

export interface ArtisticQRProps {
    data: string;
    size?: number;
    logo?: string;

    // Colors
    backgroundColor?: string;
    dotsColor?: string;
    cornerSquareColor?: string;
    cornerDotColor?: string;

    // Styles
    dotsType?: DotType;
    cornerSquareType?: CornerSquareType;
    cornerDotType?: CornerDotType;

    // Logo options
    logoSize?: number;
    logoMargin?: number;
}

const ArtisticQR = ({
    data,
    size = 300,
    logo,
    backgroundColor = "transparent",
    dotsColor = "#000000",
    cornerSquareColor = "#000000",
    cornerDotColor = "#000000",
    dotsType = "square",
    cornerSquareType = "square",
    cornerDotType = "square",
    logoSize = 0.4,
    logoMargin = 10
}: ArtisticQRProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);

    useEffect(() => {
        const qr = new QRCodeStyling({
            width: size,
            height: size,
            type: 'svg',
            data: data,
            image: logo,
            dotsOptions: {
                color: dotsColor,
                type: dotsType
            },
            backgroundOptions: {
                color: backgroundColor,
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: logoMargin,
                imageSize: logoSize
            },
            cornersSquareOptions: {
                color: cornerSquareColor,
                type: cornerSquareType
            },
            cornersDotOptions: {
                color: cornerDotColor,
                type: cornerDotType
            }
        });

        if (ref.current) {
            ref.current.innerHTML = '';
            qr.append(ref.current);

            // Force SVG to be responsive
            const svg = ref.current.querySelector('svg');
            if (svg) {
                svg.style.width = '100%';
                svg.style.height = '100%';
                svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
                // Remove fixed dimensions to allow scaling
                svg.removeAttribute('width');
                svg.removeAttribute('height');
            }
        }
        setQrCode(qr);
    }, [data, size, logo, backgroundColor, dotsColor, cornerSquareColor, cornerDotColor, dotsType, cornerSquareType, cornerDotType, logoSize, logoMargin]);


    // We can remove the second useEffect for updates since we are re-creating the instance on prop changes now.
    // This is more reliable for things like Images which might not update cleanly via the library's update() method in React.

    return (
        <div
            ref={ref}
            className="artistic-qr-container"
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        />
    );
};

export default ArtisticQR;
