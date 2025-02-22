"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import ListFormBlock from "./ListFromBlock";
import { FetchBoardsDocument } from "@/commons/graphql/graphql";

// 필요한 타입을 import
import {
  FetchBoardsQuery,
  FetchBoardsCountDocument,
} from "@/commons/graphql/graphql";
import ListPagination from "./ListPagination";

// 각 항목의 타입을 정의
type BoardItem = NonNullable<FetchBoardsQuery["fetchBoards"]>[number];

// ListFormBlock에 전달하는 props 타입 정의
export interface ListFormBlockProps {
  el: BoardItem;
  idx: number;
}

export default function ListForm() {
  const { data, refetch } = useQuery(FetchBoardsDocument);
  const { data: dataBoardsCount } = useQuery(FetchBoardsCountDocument);

  const pageScale = 5;
  const lastPage = Math.ceil(
    (dataBoardsCount?.fetchBoardsCount ?? pageScale) / 10
  );
  // console.log("lastPage:", lastPage);

  return (
    <div className="flex flex-col mx-auto items-center shadow-lg mt-5 px-12 py-6 gap-4 rounded-lg">
      <div className="w-full max-w-[1184px] h-auto flex-col gap-2">
        {/* NOTE : 여기 font 속성이 자식에게 상속되지 않음 */}
        <div className="flex items-center h-[52px] gap-2 prose-sb_16_20 px-6 py-4">
          <div className="flex justify-center w-16">번호</div>
          <div className="w-full">제목</div>
          <div className="flex justify-center w-24">작성자</div>
          <div className="flex justify-center w-24 ">날짜</div>
          <div className="w-4"></div>
        </div>
        <div className="flex flex-col gap-3">
          {data?.fetchBoards.map((el, idx) => (
            <ListFormBlock key={el._id} el={el} idx={idx} />
          ))}
        </div>
      </div>
      <ListPagination
        refetch={refetch}
        lastPage={lastPage}
        pageScale={pageScale}
      />
    </div>
  );
}
