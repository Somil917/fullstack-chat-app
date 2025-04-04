import { useChatStore } from "@/stores/useChatStore";
import { CircleX, Image, SendHorizontal } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import toast from "react-hot-toast";

const ChatInput = () => {
  const [text, setText] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { sendMessage } = useChatStore();

  const setImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = reader.result as string;
      setPreviewImage(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const image = previewImage;

    if (!text.trim() && !image) {
      return;
    }

    try {
      await sendMessage({
        text: text.trim(),
        image: image,
      });

      setText("");
      setPreviewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="w-full px-3 py-2">
      {previewImage && (
        <div className="relative w-fit">
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 cursor-pointer"
          >
            <CircleX className="bg-white rounded-full" />
          </button>
          <div className="size-28 mb-1.5 rounded-md overflow-hidden flex justify-center items-center">
            <img
              className="w-full h-full object-cover"
              src={previewImage!}
              alt="preview img"
            />
          </div>
        </div>
      )}
      <form
        className="w-full flex gap-x-4 items-center"
        onSubmit={(e) => {
          onSubmitHandler(e);
        }}
      >
        <input
          className="border p-2 rounded-md border-neutral-300 w-full outline-none"
          placeholder="Type here"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          onChange={(e) => setImage(e)}
          type="file"
          accept="image/*"
          ref={fileInputRef}
          id="image"
          className="hidden"
        />
        <label
          className={`cursor-pointer ${
            previewImage ? "text-neutral-400" : "text-black"
          }`}
          htmlFor="image"
        >
          <Image />
        </label>
        <button
          className={`${
            !text.trim() && !previewImage
              ? "text-neutral-400"
              : "text-black cursor-pointer"
          }`}
          disabled={!text.trim() && !previewImage}
          type="submit"
        >
          <SendHorizontal />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
