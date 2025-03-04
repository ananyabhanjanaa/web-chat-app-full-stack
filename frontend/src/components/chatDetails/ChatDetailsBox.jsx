import React, { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";
import Overview from "./Overview";
import Member from "./Member";
import { IoSettingsOutline } from "react-icons/io5";
import ChatSetting from "./ChatSetting";
import { useSelector } from "react-redux";

const ChatDetailsBox = () => {
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const [detailView, setDetailView] = useState("overview");
	return (
		<>
			<div className="w-fit h-[60vh] p-2 flex flex-col gap-2 bg-gray-800 rounded-lg shadow-md">
				<div
					className={`flex gap-2 items-center p-2 text-gray-300 rounded-md cursor-pointer transition-all duration-200 ease-in-out shadow-sm hover:bg-gray-700 ${
						detailView === "overview" ? "bg-gray-700" : "bg-gray-900"
					}`}
					onClick={() => setDetailView("overview")}
					title="Overview"
				>
					<CiCircleInfo fontSize={18} />
					<span className="hidden sm:block">Overview</span>
				</div>
				{selectedChat?.isGroupChat && (
					<div
						className={`flex gap-2 items-center p-2 text-gray-300 rounded-md cursor-pointer transition-all duration-200 ease-in-out shadow-sm hover:bg-gray-700 ${
							detailView === "members" ? "bg-gray-700" : "bg-gray-900"
						}`}
						onClick={() => setDetailView("members")}
						title="Member"
					>
						<HiOutlineUsers fontSize={18} />
						<span className="hidden sm:block">Members</span>
					</div>
				)}
				<div
					className={`flex gap-2 items-center p-2 text-gray-300 rounded-md cursor-pointer transition-all duration-200 ease-in-out shadow-sm hover:bg-gray-700 ${
						detailView === "setting" ? "bg-gray-700" : "bg-gray-900"
					}`}
					onClick={() => setDetailView("setting")}
					title="Setting"
				>
					<IoSettingsOutline fontSize={18} />
					<span className="hidden sm:block">Setting</span>
				</div>
			</div>
			<div className="w-full h-[60vh] bg-gray-900 rounded-lg shadow-md p-4 text-gray-300">
				{detailView === "overview" && <Overview />}
				{detailView === "members" && <Member />}
				{detailView === "setting" && <ChatSetting />}
			</div>
		</>
	);
};

export default ChatDetailsBox;
