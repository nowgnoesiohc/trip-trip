"use client";

import DetailFormInfo from "./DetailFormInfo";
import DetailFormContent from "./DetailFormContent";
import DetailFormLike from "./DetailFormLike";
import DetailFormButton from "./DetailFormButton";
import DetailComment from "./DetailComment";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { FetchBoardDocument } from "@/commons/graphql/graphql";

import YouTube from "react-youtube";

export default function DetailForm() {
  const params = useParams();
  // console.log(params);
  const boardId = String(params.boardId);
  const { data } = useQuery(FetchBoardDocument, {
    variables: { boardId: boardId },
  });

  // console.log(data);

  // API에서 받은 이미지 경로에 호스트 URL 추가
  const getImageUrl = (path: string) =>
    `https://storage.googleapis.com/${path}`;

  const videoId = data?.fetchBoard.youtubeUrl;
  const opts = {
    height: "320",
    width: "480",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex-col py-10 flex gap-6 border-b">
        <div className="prose-b_28_36">{data?.fetchBoard?.title}</div>
        <DetailFormInfo
          writer={data?.fetchBoard.writer}
          address={data?.fetchBoard?.boardAddress?.address}
        />
        <DetailFormContent value={data?.fetchBoard.contents} />
        <div className="flex gap-2 w-full overflow-auto ${images?'h-[125px]':'h-0'}">
          {data?.fetchBoard?.images?.map((el, idx) =>
            el ? (
              <Image
                key={idx}
                src={getImageUrl(el)}
                alt={`이미지 ${idx + 1}`}
                width={220}
                height={220}
                style={{ objectFit: "cover" }}
              />
            ) : null
          )}
        </div>
        {videoId && (
          <div className="youtube-video">
            <YouTube videoId={videoId} opts={opts} />
          </div>
        )}
        <DetailFormLike />
        <DetailFormButton value={data?.fetchBoard._id} />
      </div>
      <DetailComment boardId={boardId} />
    </div>
  );
}
11;
