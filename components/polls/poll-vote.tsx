"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EyeOff, RotateCcw } from "lucide-react";
import { poll } from "./ts-types";
import { voteOnPoll } from "../../graphql/actions/polls";
import { useApolloClient } from "@apollo/client";
import { GET_POLL_BY_USER } from "../../graphql/quries/polls";

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type ViewMode = "ALWAYS" | "AFTER_VOTE" | "AFTER_END" | "ADMIN";

export default function PollVote({ data }: { data?: poll }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PollComponent
        mode={data?.resultVisibility}
        options={data?.options}
        title={data?.title}
        description={data?.question}
        id={data?.id}
        isVoted={data?.isVoted}
        votedOptionId={data?.votedOptionId}
        totalVotes={data?.totalVotes}
      />
    </div>
  );
}

function PollComponent({
  mode,
  options,
  title,
  description,
  id,
  isVoted,
  votedOptionId,
  totalVotes,
}: {
  mode?: ViewMode;
  options: PollOption[] | undefined;
  title?: string;
  description?: string;
  id?: string;
  isVoted?: boolean;
  votedOptionId?: string;
  totalVotes?: number;
}) {
  const client = useApolloClient();
  const [vote, { loading }] = voteOnPoll({});
  const [selectedOption, setSelectedOption] = useState<string>(
    votedOptionId ?? ""
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleVote = async () => {
    if (!selectedOption) return;

    const data = client.readQuery<{
      getPollByIdForUser: poll;
    }>({
      query: GET_POLL_BY_USER,
      variables: {
        input: {
          pollId: id,
        },
      },
    });

    const newValue = data?.getPollByIdForUser;
    if (!newValue) return;

    let updatedIsVoted = newValue.isVoted || false;
    let updatedVotedOptionId = newValue.votedOptionId || "";
    let updatedOptions = newValue.options;

    updatedIsVoted = true;
    updatedVotedOptionId = selectedOption;
    updatedOptions = newValue.options?.map((set) =>
      set.id === selectedOption ? { ...set, votes: set.votes + 1 } : set
    );

    console.log(updatedOptions);
    await client.writeQuery({
      query: GET_POLL_BY_USER,
      variables: {
        input: {
          pollId: id,
        },
      },
      data: {
        getPollByIdForUser: {
          ...newValue,
          options: updatedOptions,
          isVoted: updatedIsVoted,
          votedOptionId: updatedVotedOptionId,
          totalVotes: newValue.totalVotes + 1,
        },
      },
    });
    await vote({
      variables: {
        input: {
          pollId: id,
          optionId: selectedOption,
        },
      },
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const shouldShowResults = () => {
    switch (mode) {
      case "ALWAYS":
        return true;
      case "AFTER_VOTE":
        return isVoted;
      case "AFTER_END":
        return isSubmitted;
      default:
        return false;
    }
  };

  const resetPoll = () => {
    setSelectedOption("");
    setIsSubmitted(false);
  };

  const getModeDescription = () => {
    switch (mode) {
      case "ALWAYS":
        return "Results are visible at all times";
      case "AFTER_VOTE":
        return "Results appear immediately after voting";
      case "AFTER_END":
        return "Results appear only after submitting the poll";
      case "ADMIN":
        return "Results are never shown - anonymous voting";
    }
  };

  const getBadgeVariant = ():
    | "default"
    | "secondary"
    | "destructive"
    | "outline" => {
    switch (mode) {
      case "ALWAYS":
        return "default";
      case "AFTER_VOTE":
        return "secondary";
      case "AFTER_END":
        return "outline";
      case "ADMIN":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
          <Badge variant={getBadgeVariant()} className="ml-4 gap-1">
            {mode === "ADMIN" && <EyeOff className="h-3 w-3" />}
            {getModeDescription()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <RadioGroup
          value={selectedOption}
          onValueChange={setSelectedOption}
          disabled={!!isVoted}
          className="space-y-4"
        >
          {options?.map((option) => (
            <div key={option.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label
                    htmlFor={option.id}
                    className="font-medium cursor-pointer"
                  >
                    {option.text}
                  </Label>
                </div>
                {shouldShowResults() && (
                  <span className="text-sm text-muted-foreground">
                    {option.votes} votes
                  </span>
                )}
              </div>

              {shouldShowResults() && (
                <div className="ml-6 space-y-1">
                  <Progress
                    value={
                      totalVotes && totalVotes > 0
                        ? Math.round((option.votes / totalVotes) * 100)
                        : 0
                    }
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {totalVotes && totalVotes > 0
                      ? Math.round((option.votes / totalVotes) * 100)
                      : 0}
                    %
                  </p>
                </div>
              )}
            </div>
          ))}
        </RadioGroup>

        {shouldShowResults() && (
          <>
            <Separator />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Total votes: {totalVotes}
              </p>
            </div>
          </>
        )}

        {mode === "ADMIN" && isVoted && (
          <>
            <Separator />
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2">
                <EyeOff className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Results are kept private
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Your vote has been recorded anonymously
              </p>
            </div>
          </>
        )}

        <div className="flex gap-2">
          {mode === "AFTER_VOTE" && !isVoted && (
            <Button
              onClick={handleVote}
              disabled={!selectedOption || loading}
              className="flex-1"
            >
              {loading ? "Voting..." : "Vote"}
            </Button>
          )}

          {mode === "AFTER_END" && (
            <Button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="flex-1"
            >
              {isVoted ? "Submit Poll" : "Vote & Submit"}
            </Button>
          )}

          {(mode === "ALWAYS" || mode === "ADMIN") && (
            <Button
              onClick={handleVote}
              disabled={!selectedOption || isVoted || loading}
              className="flex-1"
            >
              {isVoted ? "Voted" : loading ? "Voting..." : "Vote"}
            </Button>
          )}

          <Button onClick={resetPoll} variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
