import React, { Fragment, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { VscCheckAll } from "react-icons/vsc";
import { CgChevronDoubleDown } from "react-icons/cg";
import gsap from "gsap";
import { SimpleDateAndTime, SimpleDateMonthDay, SimpleTime } from "../../utils/formateDateTime";

const AllMessages = ({ allMessage, sendMessage }) => {
    const chatBox = useRef();
    const adminId = useSelector((store) => store.auth?._id);
    const isTyping = useSelector((store) => store?.condition?.isTyping);
    const messageRefs = useRef([]);

    const [scrollShow, setScrollShow] = useState(true);

    
    const memoizedMessages = useMemo(() => allMessage, [allMessage]);

    useEffect(() => {
        handleScrollDownChat();
        if (chatBox.current.scrollHeight === chatBox.current.clientHeight) {
            setScrollShow(false);
        }
        const handleScroll = () => {
            const currentScrollPos = chatBox.current.scrollTop;
            setScrollShow(currentScrollPos + chatBox.current.clientHeight < chatBox.current.scrollHeight - 30);
        };
        const chatBoxCurrent = chatBox.current;
        chatBoxCurrent.addEventListener("scroll", handleScroll);
        return () => chatBoxCurrent.removeEventListener("scroll", handleScroll);
    }, [memoizedMessages, isTyping]);

    useEffect(() => {
        if (messageRefs.current.length > 0) {
            gsap.fromTo(
                messageRefs.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
            );
        }
    }, [memoizedMessages]);

    // ✅ Optimized function to send messages (prevents function recreation)
    const handleSendMessage = useCallback((message) => {
        sendMessage(message);
    }, [sendMessage]);

    const handleScrollDownChat = () => {
        if (chatBox.current) {
            chatBox.current.scrollTo({
                top: chatBox.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    return (
        <>
            {scrollShow && (
                <div
                    className="absolute bottom-16 right-4 cursor-pointer z-20 text-white/70 bg-[#004d00] hover:bg-[#00FF00] hover:text-black transition-all p-2 rounded-full shadow-md shadow-green-500/40"
                    onClick={handleScrollDownChat}
                >
                    <CgChevronDoubleDown title="Scroll Down" fontSize={24} />
                </div>
            )}
            <div
                className="flex flex-col w-full px-4 gap-2 py-3 overflow-y-auto scroll-style h-[66vh] bg-black border border-[#1A3A1A] rounded-lg shadow-lg shadow-green-500/20"
                ref={chatBox}
                style={{ 
                    backgroundImage: 'url("/check.jpeg")',
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed'
                }}
            >
                {memoizedMessages.map((message, idx) => (
                    <Fragment key={message._id}>
                        <div className="sticky top-0 flex w-full justify-center z-10">
                            {new Date(memoizedMessages[idx - 1]?.updatedAt).toDateString() !==
                                new Date(message?.updatedAt).toDateString() && (
                                <span className="text-xs font-light mb-2 mt-1 text-white/50 bg-[#1A3A1A] h-7 w-fit px-5 rounded-md flex items-center justify-center cursor-pointer shadow-md shadow-green-500/30">
                                    {SimpleDateMonthDay(message?.updatedAt)}
                                </span>
                            )}
                        </div>
                        <div
                            className={`flex items-start gap-2 ${
                                message?.sender?._id === adminId ? "flex-row-reverse text-white" : "flex-row text-gray-200"
                            }`}
                            ref={(el) => {
                                if (el) messageRefs.current[idx] = el;
                            }}
                        >
                            {message?.chat?.isGroupChat &&
                                message?.sender?._id !== adminId &&
                                (memoizedMessages[idx + 1]?.sender?._id !== message?.sender?._id ? (
                                    <img
                                        src={message?.sender?.image}
                                        alt="User"
                                        className="h-10 w-10 rounded-full border-2 border-green-500 shadow-lg shadow-green-400/30"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full"></div>
                                ))}
                            <div
                                className={`${
                                    message?.sender?._id === adminId
                                        ? "bg-black text-white border border-[#00FF00] shadow-lg shadow-green-500/30 rounded-s-lg rounded-ee-2xl"
                                        : "bg-[#1A1A1A] text-gray-200 border border-[#FFFFFF] shadow-lg shadow-gray-500/30 rounded-e-lg rounded-es-2xl"
                                } py-2 px-3 min-w-10 text-start flex flex-col relative max-w-[85%]`}
                            >
                                {message?.chat?.isGroupChat &&
                                    message?.sender?._id !== adminId && (
                                        <span className="text-xs font-bold text-start text-[#00FF00]">
                                            {message?.sender?.firstName}
                                        </span>
                                    )}
                                <div className={`mt-1 pb-1.5 ${message?.sender?._id === adminId ? "pr-16" : "pr-12"}`}>
                                    <span>{message?.message}</span>
                                    <span
                                        className="text-[11px] font-light absolute bottom-1 right-2 flex items-center gap-1.5"
                                        title={SimpleDateAndTime(message?.updatedAt)}
                                    >
                                        {SimpleTime(message?.updatedAt)}
                                        {message?.sender?._id === adminId && <VscCheckAll color="#00FF00" fontSize={14} />}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                ))}
                {isTyping && (
                    <div id="typing-animation" className="flex gap-1">
                        <span className="h-2 w-2 bg-[#00FF00] animate-bounce rounded-full"></span>
                        <span className="h-2 w-2 bg-[#00FF00] animate-bounce rounded-full delay-100"></span>
                        <span className="h-2 w-2 bg-[#00FF00] animate-bounce rounded-full delay-200"></span>
                    </div>
                )}
            </div>
        </>
    );
};

export default AllMessages;
