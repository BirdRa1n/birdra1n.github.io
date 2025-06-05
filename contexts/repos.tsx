"use client";

import GitHubRepo from "@/types/github";
import getRepos from "@/utils/github/repo";
import storage from "@/utils/storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface SidebarContextType {
    repos: GitHubRepo[];
    fetchingRepos?: boolean;
}

const ReposContext = createContext<SidebarContextType | undefined>(undefined);

export const ReposProvider = ({ children }: { children: ReactNode }) => {
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [fetchingRepos, setFetchingRepos] = useState(true);

    useEffect(() => {
        getRepos().then((data) => {
            setRepos(data);
            setFetchingRepos(false);
            storage.setItem('repos', data);
        }
        ).catch((error) => {
            console.error("Error fetching repositories:", error);
            setFetchingRepos(false);
        });
    }, []);

    return (
        <ReposContext.Provider
            value={{
                repos,
                fetchingRepos
            }}
        >
            {children}
        </ReposContext.Provider>
    );
};

export const useReposContext = () => {
    const context = useContext(ReposContext);
    if (!context) {
        throw new Error("useReposContext deve ser usado dentro de um ReposProvider");
    }
    return context;
};