import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Twitter, Link as LinkIcon, Edit2, Save, X } from 'lucide-react';

interface SocialLinksData {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
}

const SocialLinks: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [links, setLinks] = useState<SocialLinksData>({});

    useEffect(() => {
        const saved = localStorage.getItem('codejudge_socials');
        if (saved) {
            setLinks(JSON.parse(saved));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('codejudge_socials', JSON.stringify(links));
        setIsEditing(false);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg mb-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <LinkIcon className="text-blue-400" />
                    Social Profiles
                </h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                    >
                        <Edit2 size={16} />
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="p-2 text-red-400 hover:bg-gray-700 rounded transition-colors"
                        >
                            <X size={16} />
                        </button>
                        <button
                            onClick={handleSave}
                            className="p-2 text-green-400 hover:bg-gray-700 rounded transition-colors"
                        >
                            <Save size={16} />
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GitHub */}
                <div className="flex items-center gap-3 bg-gray-900 p-3 rounded-lg border border-gray-700">
                    <Github className="text-white" size={20} />
                    {isEditing ? (
                        <input
                            type="text"
                            placeholder="GitHub Username"
                            value={links.github || ''}
                            onChange={(e) => setLinks({ ...links, github: e.target.value })}
                            className="bg-transparent border-none focus:outline-none text-sm w-full text-white"
                        />
                    ) : (
                        <a
                            href={links.github ? `https://github.com/${links.github}` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${links.github ? 'text-blue-400 hover:underline' : 'text-gray-500 cursor-default'}`}
                        >
                            {links.github || 'Not connected'}
                        </a>
                    )}
                </div>

                {/* LinkedIn */}
                <div className="flex items-center gap-3 bg-gray-900 p-3 rounded-lg border border-gray-700">
                    <Linkedin className="text-blue-500" size={20} />
                    {isEditing ? (
                        <input
                            type="text"
                            placeholder="LinkedIn Username"
                            value={links.linkedin || ''}
                            onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
                            className="bg-transparent border-none focus:outline-none text-sm w-full text-white"
                        />
                    ) : (
                        <a
                            href={links.linkedin ? `https://linkedin.com/in/${links.linkedin}` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${links.linkedin ? 'text-blue-400 hover:underline' : 'text-gray-500 cursor-default'}`}
                        >
                            {links.linkedin || 'Not connected'}
                        </a>
                    )}
                </div>

                {/* Twitter */}
                <div className="flex items-center gap-3 bg-gray-900 p-3 rounded-lg border border-gray-700">
                    <Twitter className="text-sky-400" size={20} />
                    {isEditing ? (
                        <input
                            type="text"
                            placeholder="Twitter Handle"
                            value={links.twitter || ''}
                            onChange={(e) => setLinks({ ...links, twitter: e.target.value })}
                            className="bg-transparent border-none focus:outline-none text-sm w-full text-white"
                        />
                    ) : (
                        <a
                            href={links.twitter ? `https://twitter.com/${links.twitter}` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${links.twitter ? 'text-blue-400 hover:underline' : 'text-gray-500 cursor-default'}`}
                        >
                            {links.twitter || 'Not connected'}
                        </a>
                    )}
                </div>

                {/* Website */}
                <div className="flex items-center gap-3 bg-gray-900 p-3 rounded-lg border border-gray-700">
                    <LinkIcon className="text-pink-400" size={20} />
                    {isEditing ? (
                        <input
                            type="text"
                            placeholder="Personal Website URL"
                            value={links.website || ''}
                            onChange={(e) => setLinks({ ...links, website: e.target.value })}
                            className="bg-transparent border-none focus:outline-none text-sm w-full text-white"
                        />
                    ) : (
                        <a
                            href={links.website || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${links.website ? 'text-blue-400 hover:underline' : 'text-gray-500 cursor-default'}`}
                        >
                            {links.website || 'Not connected'}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SocialLinks;
