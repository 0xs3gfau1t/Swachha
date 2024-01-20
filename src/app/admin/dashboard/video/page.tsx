'use client';

import { BoundingBox } from '@/components/BoundingBox';
import UploadVideoComponent from '@/components/UploadComponent';
import { FRAME_COUNT_THRESHOLD, LITTER_API_URL, ML_URL } from '@/constants';
import { reportLitteringServer } from '@/lib/serverActions/report';
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
  frames: Classes[][];
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

function report(frames: Classes[][], index: number, count: number) {
  console.log(
    'Reporting from ',
    Math.max(0, index - count),
    ' to ',
    Math.min(frames.length - 1, index)
  );

  // Generate clip
}

function reportLittering(data: Response | null | undefined) {
  if (!data) return;
  let litterFrameCount = 0;

  let hasLittering = false;

  data.frames.forEach((frame, ind) => {
    if (frame[0]?.name === 'litter_throw') {
      litterFrameCount++;
    } else if (litterFrameCount < FRAME_COUNT_THRESHOLD && frame[0]?.name !== 'litter_throw') {
      litterFrameCount = 0;
    } else if (litterFrameCount > FRAME_COUNT_THRESHOLD && frame[0]?.name !== 'litter_throw') {
      hasLittering = true;
      // TODO: Optimize
      report(data.frames, ind - 1, litterFrameCount);
      litterFrameCount = 0;
    }
  });
  return hasLittering;
}

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

    const vidForm = new FormData();
    vidForm.append('vid', video);
    fetch(`${ML_URL}/api/video`, { method: 'POST', body: vidForm })
      .then(async (res) => {
        if (res.status == 200) {
          const vidData = (await res.json()) as Response;
          setData(vidData);

          if (reportLittering(vidData)) {
            reportLitteringServer(vidForm);
          }
        }
      })
      .finally(() => setPredicting(false));
  };

  return (
    <>
      {!video && (
        <UploadVideoComponent
          accept='video/*'
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

                if (!parentPos || !childPos) {
                  setRelativePos(null);
                } else {
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
                {data.frames[currentFrame].map((d, idx) => (
                  <BoundingBox key={idx} relativePos={relativePos} detection={d} />
                ))}
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
