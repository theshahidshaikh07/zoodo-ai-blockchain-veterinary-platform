'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Users, Instagram, ArrowRight } from 'lucide-react';

interface CommunityPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const CommunityPopup = ({ isOpen, onClose }: CommunityPopupProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md w-[90%] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Users className="w-5 h-5 text-primary" />
                        Join the Community
                    </DialogTitle>
                    <DialogDescription>
                        Connect with fellow pet parents, share stories, and get expert advice.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* WhatsApp Option */}
                    <a
                        href="https://chat.whatsapp.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-green-50/50 dark:hover:bg-green-950/20 hover:border-green-200 dark:hover:border-green-800 transition-all cursor-pointer group"
                    >
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                            {/* WhatsApp SVG - Custom to ensure brand recognition */}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="font-semibold text-foreground group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">WhatsApp Group</h3>
                            <p className="text-sm text-muted-foreground">Daily tips & discussions</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                    </a>

                    {/* Instagram Option */}
                    <a
                        href="https://instagram.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-pink-50/50 dark:hover:bg-pink-950/20 hover:border-pink-200 dark:hover:border-pink-800 transition-all cursor-pointer group"
                    >
                        <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-300">
                            <Instagram className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="font-semibold text-foreground group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Instagram Community</h3>
                            <p className="text-sm text-muted-foreground">Visual stories & updates</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                    </a>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CommunityPopup;
