export default function Video({
  videoBlob,
  vidRef,
  setRelativePos,
  parentRef,
  setCurrentFrame,
}: any) {
  return (
    <video
      src={videoBlob}
      className='h-full absolute m-auto inset-0'
      controls={true}
      ref={vidRef}
      onPlay={() => {
        const parentPos = parentRef.current?.getBoundingClientRect();
        const childPos = vidRef.current?.getBoundingClientRect();
        if (!parentPos || !childPos) setRelativePos(undefined);
        else
          setRelativePos({
            left: childPos.left - parentPos.left,
            top: childPos.top - parentPos.top,
            right: parentPos.right - childPos.right,
            bottom: parentPos.bottom - childPos.bottom,
            width: childPos.width,
            height: childPos.height,
          });
        if (timer == -1) {
          const t = setInterval(
            () => {
              if (!vidRef.current?.paused && data != null) {
                const curFrame = Math.min(
                  Math.round(data.fps * vidRef.current?.currentTime),
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
  );
}
