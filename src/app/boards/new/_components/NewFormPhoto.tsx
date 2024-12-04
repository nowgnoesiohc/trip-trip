import InputFormTitle from "./NewFormTitle";
import { IoAddOutline } from "react-icons/io5";
import { gql, useMutation } from "@apollo/client";
import { useRef, useState } from "react";
import { useToast } from "@/components/hooks/use-toast";

const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file) {
      url
    }
  }
`;

export default function InputFormPhoto({ title }: IInputFormTextProps) {
  const { toast } = useToast();
  const [uploadFile] = useMutation(UPLOAD_FILE);
  const [imageUrl, setImageUrl] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);
  const getImageUrl = (path: string) =>
    `https://storage.googleapis.com/${path}`;

  const onChangeFile = async (event) => {
    event.stopPropagation();
    const file = event.target.files?.[0];
    console.log("Selected file:", file);

    if (!file) {
      console.log("No file selected.");
      return;
    }

    try {
      const result = await uploadFile({ variables: { file } });
      console.log(result);
      // Check if data and URL exist
      const uploadedUrl = result?.data?.uploadFile?.url;
      if (uploadedUrl) {
        console.log("Uploaded image URL:", uploadedUrl);
        setImageUrl(uploadedUrl);
      } else {
        console.error("Upload failed, URL not returned.");
      }
    } catch (error) {
      // Log the Apollo error for more insights
      console.error("File upload error:", error);
      toast({
        description: "이미지를 업로드하는 도중 에러가 발생했습니다!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="content-area">
      <InputFormTitle title={title} />
      <input type="file" onChange={onChangeFile} />
      {imageUrl && (
        <img
          src={`https://storage.googleapis.com/${imageUrl}`}
          alt="Uploaded"
        />
      )}
      <div className="photo-area">
        {[1, 1, 1].map((el, idx) => (
          <div key={idx}>
            <input
              type="file"
              className="hidden"
              ref={imageRef}
              onChange={onChangeFile}
            />
            <div
              className="flex flex-col items-center justify-center prose-r_16_24 text-gray-400 gap-2"
              onClick={() => imageRef.current?.click()}
            >
              <IoAddOutline size={40} />
              클릭해서 사진 업로드
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
