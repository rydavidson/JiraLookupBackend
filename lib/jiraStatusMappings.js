module.exports = Object.freeze({
        Backlog: {
            name: "Backlog",
            publicStatus: "Validated by Sustaining Support, in the backlog",
            description: "This item has been validated by a member of the Sustaining Support team and is waiting to be reviewed by a development team."
        },
        Grooming: {
            name: "Grooming",
            publicStatus: "Pending approval",
            description: "This item is being reviewed to ensure all applicable information is present."
        },
        Ready: {
            name: "Ready",
            publicStatus: "Approved",
            description: "This item has been reviewed and approved, and is waiting for an engineering to begin analysing the issue."
        },
        Analysing: {
            name: "Analysing Issue",
            publicStatus: "Looking into the issue",
            description: "An engineer is analysing this issue to determine next steps."
        },
        BeingFixed: {
            name: "Being Fixed",
            publicStatus: "Fixing the issue",
            description: "An engineer is currently working on fixing this issue."
        },
        Feedback: {
            name: "Awaiting Feedback",
            publicStatus: "Waiting on third party",
            description: "This item is waiting on feedback or more information"
        },
        Review: {
            name: "In Review",
            publicStatus: "Potentially fixed, being reviewed",
            description: "The engineer has made changes to fix this item, and these changes are being reviewed. This does not mean the issue is fixed."
        },
        Testing: {
            name: "In Testing",
            publicStatus: "Undergoing QA Testing",
            description: "This issue appears to be fixed, and is undergoing full QA validation to ensure the fix covers all scenarios."
        },
        Done: {
            name: "Done",
            publicStatus: "Fixed",
            description: "This issue is fixed and has been validated."

        },
        ENGSUPP: {
            name: "ENGSUPP",
            publicStatus: "Not Validated",
            description: "This bug was added to the backlog without being validated by Sustaining Support. It will not be evaluated by engineering until it is validated."
        },
        WontFix: {
            name: "Won't Fix",
            publicStatus: "Won't Fix",
            description: "This bug will not be fixed."
        }
});