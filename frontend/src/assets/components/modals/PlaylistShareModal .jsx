import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Copy, X, Check } from 'lucide-react';

const PlaylistShareModal = ({
  isOpen,
  onClose,
  playlist,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [shareCode, setShareCode] = useState()
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareCode);
    setIsCopied(true);
  };
  useEffect(()=>{
    setShareCode(playlist.shareCode)
  },[])
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 text-white bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-[#1A1A1A] rounded-xl border border-[#333] w-full max-w-md"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#333]">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Link size={18} />
                Share Playlist
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <p className="text-center text-gray-300">
                  Share this code with others to give them access to your playlist
                </p>

                <div className="bg-[#262626] border border-[#333] rounded-lg p-4 flex items-center justify-between">
                  <code className="font-mono text-2xl Manrope-Bold text-center text-white tracking-wider flex-1">
                    {shareCode}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 ml-4 rounded-lg hover:bg-[#333] transition-colors relative"
                    title={isCopied ? 'Copied!' : 'Copy to clipboard'}
                    disabled={isCopied}
                  >
                    {isCopied ? (
                      <>
                        <Check size={20} className="text-green-500" />
                        <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-[#333] text-xs text-white px-2 py-1 rounded whitespace-nowrap">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <Copy size={20} className="text-[#A0A0A0] hover:text-white" />
                    )}
                  </button>
                </div>


              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default PlaylistShareModal