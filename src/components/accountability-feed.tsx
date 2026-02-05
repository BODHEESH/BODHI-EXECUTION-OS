"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, MessageCircle, Trophy, Target, Calendar, CheckCircle } from "lucide-react";

interface AccountabilityFeedProps {
  userId: string;
  userRole: 'ME' | 'WIFE';
}

export function AccountabilityFeed({ userId, userRole }: AccountabilityFeedProps) {
  const [shares, setShares] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchShares();
    }
  }, [userId]);

  const fetchShares = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/accountability?userId=${userId}`);
      const data = await response.json();
      setShares(data);
    } catch (error) {
      console.error("Failed to fetch accountability shares:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addReaction = async (shareId: string, reaction: string) => {
    try {
      await fetch("/api/accountability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: shareId,
          reaction,
        }),
      });
      fetchShares();
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  const getShareIcon = (shareType: string) => {
    switch (shareType) {
      case 'GOAL':
        return <Target className="h-4 w-4" />;
      case 'TASK':
        return <CheckCircle className="h-4 w-4" />;
      case 'DAILY_TRACKER':
        return <Calendar className="h-4 w-4" />;
      case 'WEEKLY_PLAN':
        return <Calendar className="h-4 w-4" />;
      case 'ACHIEVEMENT':
        return <Trophy className="h-4 w-4" />;
      default:
        return <Share2 className="h-4 w-4" />;
    }
  };

  const getShareColor = (shareType: string) => {
    switch (shareType) {
      case 'GOAL':
        return 'from-purple-500 to-pink-500';
      case 'TASK':
        return 'from-blue-500 to-cyan-500';
      case 'DAILY_TRACKER':
        return 'from-green-500 to-emerald-500';
      case 'WEEKLY_PLAN':
        return 'from-orange-500 to-amber-500';
      case 'ACHIEVEMENT':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading accountability feed...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-600" />
          Accountability Partnership
        </CardTitle>
        <p className="text-xs text-gray-600 mt-1">
          {userRole === 'ME' ? 'Share your progress with your wife' : 'Support and encourage your partner'}
        </p>
      </CardHeader>

      <CardContent className="pt-4">
        {shares.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 mb-2">No shared updates yet</p>
            <p className="text-xs text-gray-400">
              {userRole === 'ME' 
                ? 'Share your goals and achievements with your wife for accountability!' 
                : 'Your partner will share their progress here!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {shares.map((share) => {
              const isReceived = share.toUserId === userId;
              const shareColor = getShareColor(share.shareType);
              const shareIcon = getShareIcon(share.shareType);

              return (
                <div
                  key={share.id}
                  className={`p-3 rounded-lg border-2 ${
                    isReceived ? 'border-pink-200 bg-pink-50' : 'border-purple-200 bg-purple-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${shareColor} text-white`}>
                      {shareIcon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {share.shareType.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(share.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium mb-2">
                        {share.message || 'Shared an update'}
                      </p>

                      {/* Reaction Section */}
                      <div className="flex items-center gap-2 mt-2">
                        {share.reaction ? (
                          <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                            <span className="text-lg">{share.reaction}</span>
                            <span className="text-xs text-gray-600">
                              {isReceived ? 'You reacted' : 'Wife reacted'}
                            </span>
                          </div>
                        ) : isReceived && userRole === 'WIFE' ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                              onClick={() => addReaction(share.id, '❤️')}
                            >
                              ❤️
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                              onClick={() => addReaction(share.id, '🔥')}
                            >
                              🔥
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                              onClick={() => addReaction(share.id, '💪')}
                            >
                              💪
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                              onClick={() => addReaction(share.id, '🎉')}
                            >
                              🎉
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Share Section */}
        {userRole === 'ME' && (
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <h4 className="text-sm font-semibold text-purple-900 mb-2">Quick Share</h4>
            <p className="text-xs text-gray-600 mb-2">
              Share your progress to build accountability and get encouragement!
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                Share Goal
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                <Trophy className="h-3 w-3 mr-1" />
                Share Win
              </Button>
            </div>
          </div>
        )}

        {/* Encouragement Section for Wife */}
        {userRole === 'WIFE' && shares.length > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
            <h4 className="text-sm font-semibold text-pink-900 mb-2">💝 Your Support Matters!</h4>
            <p className="text-xs text-gray-600">
              Your reactions and encouragement help keep your partner motivated and accountable!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
