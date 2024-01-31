import React, { useMemo } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import { MemoizedParticipantGrid } from "../../components/ParticipantGrid";

function ParticipantsViewer({ isPresenting }) {
  const {
    participants,
    pinnedParticipants,
    activeSpeakerId,
    localParticipant,
    localScreenShareOn,
    presenterId,
  } = useMeeting();

  const participantIds = useMemo(() => {
    // ... existing logic ...

    return ids;
  }, [
    participants,
    activeSpeakerId,
    pinnedParticipants,
    presenterId,
    localScreenShareOn,
  ]);

  return (
    <div>
      {participantIds.map((participantId) => {
        const participant = participants.get(participantId);
        const isParticipating = /* Your logic to determine participation */;
        return (
          <div key={participantId}>
            {isParticipating ? (
              <div className="status-rectangle-participating" />
            ) : (
              <div className="status-rectangle-not-participating" />
            )}
            <span>{participant.name}</span>
          </div>
        );
      })}
    </div>
  );
}

const MemorizedParticipantView = React.memo(
  ParticipantsViewer,
  (prevProps, nextProps) => {
    return prevProps.isPresenting === nextProps.isPresenting;
  }
);

export default MemorizedParticipantView;
