import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";
const visitorUrl = process.env.REACT_APP_VISITOR_URL;

const UNIQUE_USERS_URL = `${visitorUrl}analytics/api/v1/analytics/unique-users`;

type ContentInfo = {
  contentId: string;
  startTime: string;
  endTime: string;
};

// Sample rows the builder is pre-seeded with (already in UTC `Z` format).
const SEED_CONTENT_INFO: ContentInfo[] = [
  {
    contentId: "3628",
    startTime: "2026-07-15T19:00:00Z",
    endTime: "2026-07-15T21:00:00Z",
  },
  {
    contentId: "3627",
    startTime: "2026-07-14T19:00:00Z",
    endTime: "2026-07-14T21:00:00Z",
  },
  {
    contentId: "3612",
    startTime: "2026-07-12T01:00:00Z",
    endTime: "2026-07-12T03:00:00Z",
  },
  {
    contentId: "3611",
    startTime: "2026-07-11T21:00:00Z",
    endTime: "2026-07-11T23:00:00Z",
  },
  {
    contentId: "3610",
    startTime: "2026-07-10T19:00:00Z",
    endTime: "2026-07-10T21:00:00Z",
  },
  {
    contentId: "3609",
    startTime: "2026-07-09T20:00:00Z",
    endTime: "2026-07-09T22:00:00Z",
  },
  {
    contentId: "3595",
    startTime: "2026-07-07T20:00:00Z",
    endTime: "2026-07-07T22:00:00Z",
  },
  {
    contentId: "3594",
    startTime: "2026-07-07T16:00:00Z",
    endTime: "2026-07-07T18:00:00Z",
  },
  {
    contentId: "3593",
    startTime: "2026-07-07T00:00:00Z",
    endTime: "2026-07-07T02:00:00Z",
  },
  {
    contentId: "3592",
    startTime: "2026-07-06T19:00:00Z",
    endTime: "2026-07-06T21:00:00Z",
  },
  {
    contentId: "3585",
    startTime: "2026-07-06T01:00:00Z",
    endTime: "2026-07-06T03:00:00Z",
  },
  {
    contentId: "3584",
    startTime: "2026-07-05T20:00:00Z",
    endTime: "2026-07-05T22:00:00Z",
  },
  {
    contentId: "3577",
    startTime: "2026-07-04T21:00:00Z",
    endTime: "2026-07-04T23:00:00Z",
  },
  {
    contentId: "3576",
    startTime: "2026-07-04T17:00:00Z",
    endTime: "2026-07-04T19:00:00Z",
  },
  {
    contentId: "3566",
    startTime: "2026-07-04T01:30:00Z",
    endTime: "2026-07-04T03:30:00Z",
  },
  {
    contentId: "3565",
    startTime: "2026-07-03T22:00:00Z",
    endTime: "2026-07-04T00:00:00Z",
  },
  {
    contentId: "3564",
    startTime: "2026-07-03T18:00:00Z",
    endTime: "2026-07-03T20:00:00Z",
  },
  {
    contentId: "3557",
    startTime: "2026-07-03T03:00:00Z",
    endTime: "2026-07-03T05:00:00Z",
  },
  {
    contentId: "3448",
    startTime: "2026-07-02T23:00:00Z",
    endTime: "2026-07-03T01:00:00Z",
  },
  {
    contentId: "3447",
    startTime: "2026-07-02T19:00:00Z",
    endTime: "2026-07-02T21:00:00Z",
  },
];

const emptyDraft = { contentId: "", startTime: "", endTime: "" };

const stickyHead = {
  position: "sticky" as const,
  top: 0,
  zIndex: 1,
};

/**
 * Converts a `datetime-local` value ("yyyy-MM-ddTHH:mm") into the UTC `Z`
 * string the API expects. The typed wall-clock time is treated as UTC.
 */
const toUtcZ = (local: string): string => {
  if (!local) return "";
  // datetime-local has no seconds by default; ensure "...:ss" then add Z.
  return local.length === 16 ? `${local}:00Z` : `${local}Z`;
};

export default function UniqueVisitorTab() {
  // Binge+ admins can only view results; they don't build the payload.
  const isBingePlusAdmin = localStorage.getItem("bingePlusAdmin") === "true";
  const [entries, setEntries] = useState<ContentInfo[]>(SEED_CONTENT_INFO);
  const [draft, setDraft] = useState(emptyDraft);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleAddEntry = () => {
    if (!draft.contentId.trim() || !draft.startTime || !draft.endTime) {
      toast.error("Content ID, start time and end time are all required.");
      return;
    }
    if (draft.startTime >= draft.endTime) {
      toast.error("Start time must be before end time.");
      return;
    }
    setEntries((prev) => [
      ...prev,
      {
        contentId: draft.contentId.trim(),
        startTime: toUtcZ(draft.startTime),
        endTime: toUtcZ(draft.endTime),
      },
    ]);
    setDraft(emptyDraft);
  };

  const handleRemoveEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchUniqueUsers = async (contentInfo: ContentInfo[]) => {
    setLoading(true);
    setHasSubmitted(true);
    try {
      const response = await axios.post(UNIQUE_USERS_URL, { contentInfo });
      setRows(response?.data?.data || []);
    } catch (err) {
      console.log("Error fetching unique users", err);
      toast.error("Failed to fetch unique visitors.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!entries.length) {
      toast.error("Add at least one content entry before submitting.");
      return;
    }
    fetchUniqueUsers(entries);
  };

  // Binge+ admins can't submit, so load the seeded content automatically.
  useEffect(() => {
    if (isBingePlusAdmin) {
      fetchUniqueUsers(SEED_CONTENT_INFO);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBingePlusAdmin]);

  return (
    <div className="space-y-6">
      {!isBingePlusAdmin && (
        <>
          {/* Builder: add a content entry to the request payload */}
          <div className="border-2 border-slate-200 rounded-md p-4 bg-slate-50">
            <p className="text-sm font-medium mb-3">Add Content</p>
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="space-y-2 sm:w-40">
                <Label className="font-normal">Content ID</Label>
                <Input
                  value={draft.contentId}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, contentId: e.target.value }))
                  }
                  placeholder="e.g. 3612"
                />
              </div>
              <div className="space-y-2 sm:w-56">
                <Label className="font-normal">Start Time (UTC)</Label>
                <Input
                  type="datetime-local"
                  value={draft.startTime}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, startTime: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2 sm:w-56">
                <Label className="font-normal">End Time (UTC)</Label>
                <Input
                  type="datetime-local"
                  value={draft.endTime}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, endTime: e.target.value }))
                  }
                />
              </div>
              <Button type="button" onClick={handleAddEntry} className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          {/* Staged entries that will be sent in the request */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Staged Content ({entries.length})
              </p>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !entries.length}
              >
                {loading ? "Loading..." : "Get Unique Visitors"}
              </Button>
            </div>
            <Table className="text-center border-2 border-slate-100">
              <TableHeader className="bg-slate-200">
                <TableRow>
                  <TableHead className="text-left">Content ID</TableHead>
                  <TableHead className="text-center">Start Time</TableHead>
                  <TableHead className="text-center">End Time</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length ? (
                  entries.map((entry, index) => (
                    <TableRow key={`${entry.contentId}-${index}`}>
                      <TableCell className="font-medium text-left">
                        {entry.contentId}
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.startTime}
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.endTime}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveEntry(index)}
                          aria-label="Remove entry"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-[80px] text-center">
                      No content added yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Results */}
      <Table className="text-center border-2 border-slate-100">
        <TableHeader className="text-center bg-slate-500 text-white">
          <TableRow>
            <TableHead
              style={stickyHead}
              className="bg-slate-500 text-white text-left"
            >
              Match
            </TableHead>
            <TableHead
              style={stickyHead}
              className="bg-slate-500 text-white text-center"
            >
              Started At (BD)
            </TableHead>
            <TableHead
              style={stickyHead}
              className="bg-slate-500 text-white text-center"
            >
              Ended At (BD)
            </TableHead>
            <TableHead
              style={stickyHead}
              className="bg-slate-500 text-white text-center"
            >
              Visitor Count
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-[100px] text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : rows?.length ? (
            rows.map((row) => (
              <TableRow key={row.contentId}>
                <TableCell className="font-medium text-left">
                  {row?.contentName}
                </TableCell>
                <TableCell className="text-center">{row?.startTime}</TableCell>
                <TableCell className="text-center">{row?.endTime}</TableCell>
                <TableCell className="text-center">
                  {row?.uniqueUserCount}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-[100px] text-center">
                {hasSubmitted
                  ? "No data found"
                  : "Add content and submit to see unique visitors"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
