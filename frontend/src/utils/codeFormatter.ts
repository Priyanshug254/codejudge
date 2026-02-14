export const formatCode = (code: string, language: string): string => {
    let formatted = code;

    if (language === 'java') {
        // Basic Java formatting
        formatted = formatted
            .replace(/\{/g, ' {\n')
            .replace(/\}/g, '\n}\n')
            .replace(/;/g, ';\n')
            .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive newlines
            .split('\n')
            .map(line => line.trim())
            .join('\n');
    } else if (language === 'python') {
        // Basic Python formatting
        formatted = formatted
            .split('\n')
            .map(line => line.trim())
            .join('\n')
            .replace(/\n\s*\n\s*\n/g, '\n\n');
    } else if (language === 'cpp') {
        // Basic C++ formatting
        formatted = formatted
            .replace(/\{/g, ' {\n')
            .replace(/\}/g, '\n}\n')
            .replace(/;/g, ';\n')
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .split('\n')
            .map(line => line.trim())
            .join('\n');
    }

    return formatted;
};
