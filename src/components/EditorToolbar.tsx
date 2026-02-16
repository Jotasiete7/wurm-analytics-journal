import { Image, ImagePlus, Star, Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';

interface EditorToolbarProps {
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    onInsert: (text: string) => void;
}

interface ImageModalState {
    isOpen: boolean;
    type: 'simple' | 'withSize' | 'withCaption';
}

const EditorToolbar = ({ textareaRef, onInsert }: EditorToolbarProps) => {
    const [imageModal, setImageModal] = useState<ImageModalState>({ isOpen: false, type: 'simple' });
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [imageWidth, setImageWidth] = useState('700');
    const [imageCaption, setImageCaption] = useState('');

    const insertText = (text: string) => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);

            // Replace {selection} placeholder with selected text
            const finalText = text.replace('{selection}', selectedText || '');

            onInsert(finalText);

            // Focus back on textarea
            setTimeout(() => textarea.focus(), 0);
        }
    };

    const openImageModal = (type: 'simple' | 'withSize' | 'withCaption') => {
        setImageModal({ isOpen: true, type });
        setImageUrl('');
        setImageAlt('');
        setImageCaption('');
    };

    const closeImageModal = () => {
        setImageModal({ isOpen: false, type: 'simple' });
    };

    const insertImage = () => {
        if (!imageUrl) {
            alert('Por favor, insira a URL da imagem');
            return;
        }

        let imageCode = '';

        switch (imageModal.type) {
            case 'simple':
                imageCode = `![${imageAlt || 'Imagem'}](${imageUrl})`;
                break;

            case 'withSize':
                imageCode = `<div style="text-align: center; margin: 2rem 0;">
  <img src="${imageUrl}" alt="${imageAlt || 'Imagem'}" width="${imageWidth}" />
</div>`;
                break;

            case 'withCaption':
                imageCode = `<figure style="text-align: center; margin: 2rem 0;">
  <img src="${imageUrl}" alt="${imageAlt || 'Imagem'}" width="${imageWidth}" />
  <figcaption style="font-size: 0.875rem; color: #888; margin-top: 0.5rem; font-style: italic;">
    ${imageCaption || 'Legenda da imagem'}
  </figcaption>
</figure>`;
                break;
        }

        insertText('\n\n' + imageCode + '\n\n');
        closeImageModal();
    };

    // Define toolbar buttons configuration
    const toolbarButtons = [
        // Text formatting
        { icon: Bold, label: 'Negrito', action: () => insertText('**{selection}**'), group: 'text' },
        { icon: Italic, label: 'Itálico', action: () => insertText('*{selection}*'), group: 'text' },
        { icon: Heading1, label: 'Título 1', action: () => insertText('\n# {selection}\n'), group: 'text' },
        { icon: Heading2, label: 'Título 2', action: () => insertText('\n## {selection}\n'), group: 'text' },
        { icon: Heading3, label: 'Título 3', action: () => insertText('\n### {selection}\n'), group: 'text' },

        // Images
        { icon: Image, label: 'Imagem Simples', action: () => openImageModal('simple'), group: 'image' },
        { icon: ImagePlus, label: 'Imagem com Tamanho', action: () => openImageModal('withSize'), group: 'image' },
        { icon: Star, label: 'Imagem com Legenda', action: () => openImageModal('withCaption'), group: 'image' },

        // Lists
        { icon: List, label: 'Lista', action: () => insertText('\n- {selection}\n'), group: 'list' },
        { icon: ListOrdered, label: 'Lista Numerada', action: () => insertText('\n1. {selection}\n'), group: 'list' },
        { icon: LinkIcon, label: 'Link', action: () => insertText('[{selection}](URL)'), group: 'list' },
    ];

    return (
        <>
            <div className="sticky top-0 z-20 bg-wurm-panel border border-wurm-border rounded-t-lg p-2 flex flex-wrap gap-1">
                {toolbarButtons.map((button, index) => {
                    const Icon = button.icon;
                    const showDivider = index > 0 && toolbarButtons[index - 1].group !== button.group;

                    return (
                        <div key={index} className="flex items-center">
                            {showDivider && <div className="w-px h-8 bg-wurm-border mx-1" />}
                            <button
                                type="button"
                                onClick={button.action}
                                className="min-w-[44px] min-h-[44px] p-2 border border-wurm-border bg-wurm-bg hover:bg-wurm-accent hover:text-black hover:border-wurm-accent transition-colors rounded flex items-center justify-center group relative"
                                title={button.label}
                            >
                                <Icon size={18} />
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                    {button.label}
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Image Insert Modal */}
            {imageModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-wurm-panel border-2 border-wurm-accent rounded-lg p-6 max-w-md w-full space-y-4">
                        <h3 className="text-xl font-bold text-wurm-text">
                            {imageModal.type === 'simple' && 'Inserir Imagem'}
                            {imageModal.type === 'withSize' && 'Inserir Imagem com Tamanho'}
                            {imageModal.type === 'withCaption' && 'Inserir Imagem com Legenda'}
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-wurm-muted mb-1">URL da Imagem *</label>
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://i.imgur.com/exemplo.png"
                                    className="w-full px-3 py-2 bg-wurm-bg border border-wurm-border text-wurm-text rounded focus:border-wurm-accent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-wurm-muted mb-1">Descrição (Alt Text)</label>
                                <input
                                    type="text"
                                    value={imageAlt}
                                    onChange={(e) => setImageAlt(e.target.value)}
                                    placeholder="Descrição da imagem"
                                    className="w-full px-3 py-2 bg-wurm-bg border border-wurm-border text-wurm-text rounded focus:border-wurm-accent outline-none"
                                />
                            </div>

                            {(imageModal.type === 'withSize' || imageModal.type === 'withCaption') && (
                                <div>
                                    <label className="block text-sm text-wurm-muted mb-1">Largura (px)</label>
                                    <select
                                        value={imageWidth}
                                        onChange={(e) => setImageWidth(e.target.value)}
                                        className="w-full px-3 py-2 bg-wurm-bg border border-wurm-border text-wurm-text rounded focus:border-wurm-accent outline-none"
                                        title="Selecione a largura da imagem"
                                    >
                                        <option value="400">400px (Pequena)</option>
                                        <option value="600">600px (Média)</option>
                                        <option value="700">700px (Grande)</option>
                                        <option value="800">800px (Extra Grande)</option>
                                    </select>
                                </div>
                            )}

                            {imageModal.type === 'withCaption' && (
                                <div>
                                    <label className="block text-sm text-wurm-muted mb-1">Legenda</label>
                                    <textarea
                                        value={imageCaption}
                                        onChange={(e) => setImageCaption(e.target.value)}
                                        placeholder="Texto da legenda"
                                        rows={2}
                                        className="w-full px-3 py-2 bg-wurm-bg border border-wurm-border text-wurm-text rounded focus:border-wurm-accent outline-none resize-none"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={insertImage}
                                className="flex-1 px-4 py-2 bg-wurm-accent text-black font-bold rounded hover:opacity-90 transition-opacity"
                            >
                                Inserir
                            </button>
                            <button
                                onClick={closeImageModal}
                                className="px-4 py-2 border border-wurm-border text-wurm-muted rounded hover:text-wurm-text hover:border-wurm-accent transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditorToolbar;
