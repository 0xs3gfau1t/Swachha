import { RelativePositionType } from '@/app/admin/dashboard/video/page';

export const BoundingBox = ({
  relativePos,
  detection,
}: {
  relativePos: RelativePositionType;
  detection: any;
}) => {
  return (
    <>
      <span
        className='absolute bg-black text-white px-1 rounded-t-sm text-xs'
        style={{
          left: `${relativePos.left + detection.box[0] * relativePos.width}px`,
          bottom: `${relativePos.bottom + (1 - detection.box[1]) * relativePos.height}px`,
        }}
      >
        {detection.classId}
      </span>
      <div
        className='absolute border-2 rounded-sm cursor-pointer'
        style={{
          borderColor: 'red',
          left: `${relativePos.left + detection.box[0] * relativePos.width}px`,
          top: `${relativePos.top + detection.box[1] * relativePos.height}px`,
          right: `${relativePos.right + (1 - detection.box[2]) * relativePos.width}px`,
          bottom: `${relativePos.bottom + (1 - detection.box[3]) * relativePos.height}px`,
        }}
      />
    </>
  );
};
