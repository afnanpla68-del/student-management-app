import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Student, StudentFormData } from '../types';
import { calculateGrade } from '../utils/gradeCalculator';
import { THAI_SAMPLE_STUDENTS } from '../utils/thaiSampleData';

const COLLECTION_NAME = 'students';

/**
 * ติดตามข้อมูลนักเรียนแบบ Realtime ตาม creatorUid ของผู้ใช้ที่เข้าสู่ระบบ
 */
export function subscribeStudents(
  userId: string,
  onUpdate: (students: Student[]) => void,
  onError: (error: Error) => void
) {
  const q = query(collection(db, COLLECTION_NAME), where('creatorUid', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Student[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          studentId: data.studentId || '',
          fullName: data.fullName || '',
          gradeLevel: data.gradeLevel || '',
          attendanceStatus: data.attendanceStatus || 'มา',
          midtermScore: Number(data.midtermScore ?? 0),
          finalScore: Number(data.finalScore ?? 0),
          totalScore: Number(data.totalScore ?? 0),
          grade: data.grade || '0',
          creatorUid: data.creatorUid || userId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      });

      // เรียงลำดับเริ่มต้นตาม studentId
      list.sort((a, b) => a.studentId.localeCompare(b.studentId, 'th'));
      onUpdate(list);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, COLLECTION_NAME);
      } catch (wrappedError) {
        onError(wrappedError instanceof Error ? wrappedError : new Error(String(err)));
      }
    }
  );
}

/**
 * เพิ่มนักเรียนใหม่
 */
export async function createStudent(formData: StudentFormData, userId: string): Promise<string> {
  const totalScore = Number(formData.midtermScore) + Number(formData.finalScore);
  const grade = calculateGrade(totalScore);

  const docRef = doc(collection(db, COLLECTION_NAME));
  const newStudent: Record<string, unknown> = {
    studentId: formData.studentId.trim(),
    fullName: formData.fullName.trim(),
    gradeLevel: formData.gradeLevel.trim(),
    attendanceStatus: formData.attendanceStatus,
    midtermScore: Number(formData.midtermScore),
    finalScore: Number(formData.finalScore),
    totalScore,
    grade,
    creatorUid: userId,
  };

  try {
    await setDoc(docRef, newStudent);
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${COLLECTION_NAME}/${docRef.id}`);
    throw err;
  }
}

/**
 * อัปเดตข้อมูลนักเรียน
 */
export async function updateStudent(
  docId: string,
  formData: StudentFormData,
  userId: string
): Promise<void> {
  const totalScore = Number(formData.midtermScore) + Number(formData.finalScore);
  const grade = calculateGrade(totalScore);

  const docRef = doc(db, COLLECTION_NAME, docId);
  const updateData: Record<string, unknown> = {
    studentId: formData.studentId.trim(),
    fullName: formData.fullName.trim(),
    gradeLevel: formData.gradeLevel.trim(),
    attendanceStatus: formData.attendanceStatus,
    midtermScore: Number(formData.midtermScore),
    finalScore: Number(formData.finalScore),
    totalScore,
    grade,
    creatorUid: userId,
  };

  try {
    await updateDoc(docRef, updateData);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION_NAME}/${docId}`);
    throw err;
  }
}

/**
 * ลบข้อมูลนักเรียน
 */
export async function deleteStudent(docId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, docId);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTION_NAME}/${docId}`);
    throw err;
  }
}

/**
 * บันทึกข้อมูลตัวอย่างนักเรียน (Batch Seed)
 */
export async function seedSampleStudents(userId: string): Promise<number> {
  const batch = writeBatch(db);

  for (const sample of THAI_SAMPLE_STUDENTS) {
    const totalScore = sample.midtermScore + sample.finalScore;
    const grade = calculateGrade(totalScore);
    const docRef = doc(collection(db, COLLECTION_NAME));

    batch.set(docRef, {
      studentId: sample.studentId,
      fullName: sample.fullName,
      gradeLevel: sample.gradeLevel,
      attendanceStatus: sample.attendanceStatus,
      midtermScore: sample.midtermScore,
      finalScore: sample.finalScore,
      totalScore,
      grade,
      creatorUid: userId,
    });
  }

  try {
    await batch.commit();
    return THAI_SAMPLE_STUDENTS.length;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, COLLECTION_NAME);
    throw err;
  }
}
