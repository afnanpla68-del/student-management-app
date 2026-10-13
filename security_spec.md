# Security Specification for Student Education Hub

## 1. Data Invariants
1. Students can only be created, read, updated, or deleted by authenticated Google accounts (`request.auth != null`).
2. Every student record belongs strictly to a `creatorUid` matching `request.auth.uid`.
3. `studentId`, `fullName`, and `gradeLevel` must be non-empty strings under character limits.
4. `attendanceStatus` must strictly be one of `['มา', 'ลา', 'ขาด']`.
5. `midtermScore` must be a number between 0 and 50.
6. `finalScore` must be a number between 0 and 50.
7. `totalScore` must be equal to `midtermScore + finalScore` between 0 and 100.
8. `grade` must strictly be a valid grade string (`4`, `3.5`, `3`, `2.5`, `2`, `1.5`, `1`, `0`).
9. `creatorUid` cannot be modified during updates (`incoming().creatorUid == existing().creatorUid`).

## 2. Dirty Dozen Payloads (Negative Tests)
1. Unauthenticated write to `/students/stu123` -> PERMISSION_DENIED
2. Write with spoofed `creatorUid != request.auth.uid` -> PERMISSION_DENIED
3. Negative `midtermScore` (-5) -> PERMISSION_DENIED
4. `midtermScore` exceeding 50 (55) -> PERMISSION_DENIED
5. `finalScore` exceeding 50 (55) -> PERMISSION_DENIED
6. Invalid `attendanceStatus` ("โดดเรียน") -> PERMISSION_DENIED
7. Missing required field `fullName` -> PERMISSION_DENIED
8. Attempting to update another teacher's student document -> PERMISSION_DENIED
9. Attempting to mutate `creatorUid` on update -> PERMISSION_DENIED
10. Junk document ID exceeding 128 characters or containing illegal symbols -> PERMISSION_DENIED
11. Blanket unauthenticated listing of students collection -> PERMISSION_DENIED
12. Injecting unknown shadow properties outside the schema schema keys -> PERMISSION_DENIED
