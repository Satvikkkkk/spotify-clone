import { create } from "zustand";

type playHandler = () => void;

interface PlayerStore {
    ids: string[];
    activeId?: string;
    setId: (id: string) => void;
    setIds: (ids: string[]) => void;
    reset: () => void;
    duration: number;
    sound: any;
    setSound: (sound: any) => void;

    isPlaying: boolean;
    setIsPlaying: (isPlaying: boolean) => void;

    //handlers
    handlePlay: playHandler;
    setHandlePlay: (handlePlay: playHandler) => void;
};

const usePlayer = create<PlayerStore>((set, getState) => ({
    ids: [],
    activeId: undefined,
    setId: (id: string) => set({ activeId: id }),
    setIds: (ids: string[]) => set({ ids: ids }),
    reset: () => set({ ids: [], activeId: undefined }),
    duration: 0,
    setDuration: (duration: number) => set({ duration: duration }),
    sound: null,
    setSound: (sound: any) => set({ sound: sound }),
    handlePlay: () => { console.log('init handlePlay called') },
    setHandlePlay: (handlePlay: playHandler) => set({ handlePlay: handlePlay }),
    isPlaying: false,
    setIsPlaying: (isPlaying: boolean) => set({ isPlaying: isPlaying }),
}));

export default usePlayer;