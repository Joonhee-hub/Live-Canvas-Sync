import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Stage, Layer, Line } from 'react-konva';

const DrawingBoard = forwardRef(({ sharedWebSocket, nickname }, ref) => {
    const stageRef = useRef(null);
    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);
    const [color, setColor] = useState("#000000");

    // 🆔 내 고유 ID (메시지 자폭 방지용)
    const myId = useRef(Math.random().toString(36).substring(2, 11)).current;

    // 👤 [핵심] 내 이름 결정 시스템
    // 준삣삐의 프로젝트 환경에 맞춰서 닉네임 -> 이름 -> 기본값 순으로 체크!
    const myName = nickname || localStorage.getItem("userNick") || localStorage.getItem("username") || "";

    // 🔒 락킹 시스템 및 이름 표시 상태
    const [isLocked, setIsLocked] = useState(false);
    const [lockedUserName, setLockedUserName] = useState(""); 
    const lockTimer = useRef(null);

    const colors = ['#000000', '#ffffff', '#ff0000', '#ff8c00', '#ffff00', '#008000', '#0000ff', '#4b0082', '#8b00ff', '#ff1493'];

    useImperativeHandle(ref, () => ({
        getImageData: async() => {
            if (stageRef.current) {
                const dataURL = stageRef.current.toDataURL({fill: "#ffffff"}); 
                const response = await fetch(dataURL);
                return await response.blob();
            }
            return null;
        }
    }));

    useEffect(() => {
        if (!sharedWebSocket) return;

        const handleMessage = (event) => {
            const data = JSON.parse(event.data);

            // 내가 보낸 메시지면 락 로직 무시 (Very Important!)
            if (data.senderId === myId) return;

            if (data.type === "START") {
                setIsLocked(true);
                // 💡 상대방이 보낸 senderName을 화면에 띄우기 위해 저장!
                setLockedUserName(data.senderName || "누군가"); 
                setLines((prev) => [...prev, { points: data.point, color: data.color }]);
            }
            else if (data.type === "DRAWING") {
                setIsLocked(true);
                if (lockTimer.current) clearTimeout(lockTimer.current);

                lockTimer.current = setTimeout(() => {
                    setIsLocked(false);
                    setLockedUserName("");
                }, 2000); // 2초 뒤 자동 해제

                setLines((prevLines) => {
                    const newLines = [...prevLines];
                    if (newLines.length === 0) return prevLines;
                    const lastIndex = newLines.length - 1;
                    newLines[lastIndex].points = [...newLines[lastIndex].points, ...data.point];
                    return newLines;
                });
            } 
            else if (data.type === "CLEAR") {
                setLines([]);
                setIsLocked(false);
                setLockedUserName("");
            }
        };

        sharedWebSocket.addEventListener("message", handleMessage);
        return () => {
            sharedWebSocket.removeEventListener("message", handleMessage);
            if (lockTimer.current) clearTimeout(lockTimer.current);
        };
    }, [sharedWebSocket, myId]);

    const handleMouseDown = (e) => {
        if (isLocked) return;
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        const newLine = { points: [pos.x, pos.y], color };
        setLines([...lines, newLine]);

        if (sharedWebSocket?.readyState === WebSocket.OPEN) {
            sharedWebSocket.send(JSON.stringify({
                type: "START",
                senderId: myId,
                senderName: myName, // 👈 내 닉네임을 실어서 발사!
                point: [pos.x, pos.y],
                color: color
            }));
        }
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current || isLocked) return;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        setLines((prevLines) => {
            const newLines = [...prevLines];
            const lastIndex = newLines.length - 1;
            const lastLine = { ...newLines[lastIndex] };
            lastLine.points = [...lastLine.points, point.x, point.y];
            newLines[lastIndex] = lastLine;
            return newLines;
        });

        if (sharedWebSocket?.readyState === WebSocket.OPEN) {
            sharedWebSocket.send(JSON.stringify({
                type: "DRAWING",
                senderId: myId,
                senderName: myName, // 👈 지속적으로 내 이름 실어줌
                point: [point.x, point.y],
                color: color
            }));
        }
    };

    const handleMouseUp = () => { isDrawing.current = false; };

    const clear = () => {
        if (isLocked) {
            alert(`${lockedUserName}님이 그리는 중에는 지울 수 없습니다!`);
            return;
        }
        setLines([]);
        if (sharedWebSocket?.readyState === WebSocket.OPEN) {
            sharedWebSocket.send(JSON.stringify({ 
                type: "CLEAR",
                senderId: myId 
            }));
        }
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden', position: 'relative' }}>
            
            {/* 🛠️ 상단 툴바 */}
            <div style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#fafafa' }}>
                {colors.map((c) => (
                    <div key={c} onClick={() => !isLocked && setColor(c)} style={{ width: '28px', height: '28px', backgroundColor: c, borderRadius: '50%', cursor: isLocked ? 'not-allowed' : 'pointer', border: color === c ? '3px solid #333' : '1px solid #ddd', opacity: isLocked ? 0.5 : 1 }} />
                ))}
                <button 
                    onClick={clear} 
                    disabled={isLocked}
                    style={{ 
                        marginLeft: 'auto', backgroundColor: isLocked ? '#ccc' : '#ff4d4d', 
                        color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', 
                        fontWeight: 'bold', cursor: isLocked ? 'not-allowed' : 'pointer' 
                    }}
                >
                    지우기
                </button>
            </div>

            <div style={{ flex: 1, backgroundColor: '#fff', cursor: isLocked ? 'not-allowed' : 'crosshair', position: 'relative' }}>
                
                {/* 🔒 락 배지: 닉네임 반영 버전 */}
                {isLocked && (
                    <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, pointerEvents: 'none' }}>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px 22px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                            🔒 {lockedUserName}님이 그리는 중...
                        </div>
                    </div>
                )}

                <Stage width={600} height={550} onMouseDown={handleMouseDown} onMousemove={handleMouseMove} onMouseup={handleMouseUp} onMouseLeave={handleMouseUp} ref={stageRef}>
                    <Layer>
                        {lines.map((line, i) => (
                            <Line key={i} points={line.points} stroke={line.color} strokeWidth={6} tension={0.5} lineCap="round" lineJoin="round" />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
});

export default DrawingBoard;