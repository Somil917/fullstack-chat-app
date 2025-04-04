import { Send } from "lucide-react";

const NotSelectedUser = () => {
  return (
    <div className="flex text-neutral-500 justify-center items-center flex-1">
      <div className="flex flex-col items-center gap-y-5">
        <div className="relative">
          <h1 className="font-semibold text-4xl sm:text-5xl">Just Sendit.</h1>
          <Send className="absolute size-5 sm:size-6 -right-4 -top-4"  />
        </div>
        <p>Start the conversation by selecting from the sidebar</p>
      </div>
    </div>
  );
};

export default NotSelectedUser;
