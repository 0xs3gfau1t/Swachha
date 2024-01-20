'use client';

import { BoundingBox } from '@/components/BoundingBox';
import UploadVideoComponent from '@/components/UploadComponent';
import { LITTER_API_URL } from '@/constants';
import { useRef, useState } from 'react';
import { AiOutlineCloudUpload, AiOutlineSync } from 'react-icons/ai';
import { GrClear } from 'react-icons/gr';

const DEFAULT_FPS = 30;

type Classes = {
  box: number[];
  confidence: number;
  classId: number;
  name: string;
  color: string;
};

type Response = {
  frames: Classes[];
  fps: number;
  classes: string[];
};

export type RelativePositionType = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export default function Video() {
  const [video, setVideo] = useState<File | null>(null);
  const [videoBlob, setVideoBlob] = useState<null | ArrayBuffer | string>();
  const [data, setData] = useState<Response | null>();
  const [timer, setTimer] = useState(-1);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [relativePos, setRelativePos] = useState<RelativePositionType | null>(null);
  const [predicting, setPredicting] = useState(false);

  const parentRef = useRef<HTMLDivElement>();
  const vidRef = useRef<HTMLVideoElement>();

  const predict = () => {
    setPredicting(true);
    if (!video) return;

    const data = new FormData();
    data.append('vid', video);
    fetch(LITTER_API_URL, { method: 'POST', body: data })
      .then(async (res) => {
        if (res.status == 200) {
          const data = (await res.json()) as Response;
          console.log(data);
          setData(data);
        }
      })
      .finally(() => setPredicting(false));
  };

  console.log(currentFrame, timer, data?.frames);

  return (
    <>
      {!video && (
        <UploadVideoComponent
          handleChange={(fl: FileList) => {
            if (fl) {
              setVideo(fl[0]);

              let reader = new FileReader();
              reader.onload = (e) => setVideoBlob(e.target?.result);
              reader.readAsDataURL(fl[0]);
            }
          }}
          image={'/illustrations/add-user.svg'}
        />
      )}
      {videoBlob && video && (
        <div className='flex flex-col h-full w-full'>
          <div className='w-full text-center border-b border-black text-base'>VIDEO RESULT</div>
          <div className='relative mt-10 h-1/2'>
            <video
              src={videoBlob}
              className='h-full absolute m-auto inset-0'
              controls={true}
              ref={vidRef as any}
              onPlay={() => {
                const parentPos = parentRef.current?.getBoundingClientRect();
                const childPos = vidRef.current?.getBoundingClientRect();

                if (!parentPos || !childPos) setRelativePos(null);
                else {
                  console.log('Setting relative pos');
                  setRelativePos({
                    left: childPos.left - parentPos.left,
                    top: childPos.top - parentPos.top,
                    right: parentPos.right - childPos.right,
                    bottom: parentPos.bottom - childPos.bottom,
                    width: childPos.width,
                    height: childPos.height,
                  });
                }

                if (timer == -1) {
                  const t = setInterval(
                    () => {
                      if (!vidRef.current?.paused && data != null) {
                        const curFrame = Math.min(
                          Math.round(data.fps * (vidRef.current?.currentTime || DEFAULT_FPS)),
                          data.frames.length - 1
                        );
                        setCurrentFrame(curFrame);
                      }
                    },
                    (1 / data.fps) * 1000
                  );
                  setTimer(t);
                }
              }}
              onEnded={() => {
                clearInterval(timer);
                setTimer(-1);
              }}
              onPause={() => {
                clearInterval(timer);
                setTimer(-1);
              }}
            />
            {relativePos != null && currentFrame != undefined && data != null && (
              <>
                {data.frames[currentFrame].map((d, idx) => {
                  console.log('Box for: ', currentFrame);
                  return <BoundingBox key={idx} relativePos={relativePos} detection={d} />;
                })}
              </>
            )}
          </div>
          <div className='h-1/2 flex flex-col justify-start gap-3 flex-grow p-2 max-h-[50%] overflow-hidden'>
            <div className='flex gap-x-5 self-center shadow-md border border-black rounded-md px-2 py-1'>
              {!predicting ? (
                <AiOutlineCloudUpload size='2em' onClick={predict} />
              ) : (
                <AiOutlineSync size='2em' className='animate-spin' />
              )}
              <GrClear
                size='2em'
                onClick={() => {
                  setVideo(null);
                  setData(null);
                  setCurrentFrame(-1);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
