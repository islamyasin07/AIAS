import SectionHeader from "../components/SectionHeader";
import { card } from "../ui/utils";

export default function About() {
  return (
    <div style={{ padding: "0 14px 24px" }}>
      <SectionHeader title="About AIAS – An-Najah Chapter" />
      <article style={card(false, "dark")}>
        <p style={{ color: "rgba(255,255,255,.9)", lineHeight: 1.8 }}>
          AIAS هو مجتمع طلابي يهدف لدعم طلاب العمارة عبر فعاليات، موارد تعليمية، وفرص تعاون.
          نسعى لتعزيز ثقافة التصميم، بناء الشبكات، وتسهيل الانتقال من مقاعد الدراسة إلى سوق العمل.
        </p>
        <ul style={{ color: "rgba(255,255,255,.85)", marginTop: 12 }}>
          <li>ورش عمل واستوديوهات تصميم.</li>
          <li>مكتبة موارد: روابط، دورات، قوالب، ومراجع.</li>
          <li>فعاليات مجتمعية ومسابقات طلابية.</li>
        </ul>
      </article>
    </div>
  );
}
