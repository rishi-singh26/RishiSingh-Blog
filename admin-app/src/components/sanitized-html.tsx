import DOMPurify from 'dompurify';

const SanitizedHtmlComponent = ({ htmlString }: { htmlString: string }) => {
    // Sanitize the incoming HTML string
    const sanitizedHtml = DOMPurify.sanitize(htmlString);

    return (
        <p dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    );
};

export default SanitizedHtmlComponent;
