
const PDFDocument = require('pdfkit');

const generatePDFReport = (analysisData, userData) => {
   return new Promise((resolve, reject) => {
      try {
         const doc = new PDFDocument({
            size: 'A4',
            margin: 40,
            bufferPages: true,
            autoFirstPage: true
         });

         const buffers = [];

         doc.on('data', chunk => buffers.push(chunk));
         doc.on('error', reject);

         doc.on('end', () => {
            resolve(Buffer.concat(buffers));
         });

         // ResumeIQ colour palette
         const colors = {
            forest: '#2F4034',
            red: '#A43D35',
            gold: '#D6A83D',
            cream: '#F3EBDD',
            card: '#FAF7EF',
            charcoal: '#263329',
            muted: '#697067',
            border: '#DDD5C5',
            white: '#FFFFFF'
         };

         const pageWidth = 595.28;
         const pageHeight = 841.89;
         const left = 40;
         const right = 555;
         const contentWidth = right - left;
         const bottomLimit = 770;

         let currentY = 0;
         let isFirstPage = true;

         const safeText = value =>
            value === undefined || value === null
               ? ''
               : String(value);

         const score = Number(analysisData.atsScore ?? 0);

         const ratingColor =
            score >= 75
               ? colors.forest
               : score >= 50
                  ? colors.gold
                  : colors.red;

         const addPageHeader = () => {
            if (isFirstPage) {
               doc.rect(0, 0, pageWidth, 120).fill(colors.forest);

               doc.fillColor(colors.white)
                  .font('Helvetica-Bold')
                  .fontSize(25)
                  .text('ResumeIQ', left, 30);

               doc.fillColor(colors.gold)
                  .font('Helvetica')
                  .fontSize(11)
                  .text(
                     'AI-Powered Resume Analyzer & ATS Score Checker',
                     left,
                     61
                  );

               doc.fillColor('#E5EBE7')
                  .fontSize(9)
                  .text(
                     `Report Generated: ${new Date().toLocaleDateString()}`,
                     left,
                     85
                  );

               currentY = 140;
               isFirstPage = false;
            } else {
               doc.rect(0, 0, pageWidth, 58).fill(colors.forest);

               doc.fillColor(colors.white)
                  .font('Helvetica-Bold')
                  .fontSize(16)
                  .text('ResumeIQ', left, 19);

               doc.fillColor(colors.gold)
                  .font('Helvetica')
                  .fontSize(9)
                  .text('ATS Compatibility Analysis Report', 145, 23);

               currentY = 78;
            }
         };

         const ensureSpace = (height) => {
            if (currentY + height > bottomLimit) {
               doc.addPage();
               addPageHeader();
            }
         };

         const addSectionTitle = title => {
            ensureSpace(35);

            doc.fillColor(colors.forest)
               .font('Helvetica-Bold')
               .fontSize(13)
               .text(title, left, currentY);

            currentY += 22;
         };

         const addParagraph = (
            text,
            options = {}
         ) => {
            const fontSize = options.fontSize || 9;
            const color = options.color || colors.charcoal;
            const width = options.width || contentWidth;
            const font = options.font || 'Helvetica';

            doc.font(font).fontSize(fontSize);

            const height = doc.heightOfString(
               safeText(text),
               { width, lineGap: 3 }
            );

            ensureSpace(height + 8);

            doc.fillColor(color)
               .font(font)
               .fontSize(fontSize)
               .text(safeText(text), left, currentY, {
                  width,
                  lineGap: 3
               });

            currentY += height + 9;
         };

         const addBullet = text => {
            doc.font('Helvetica').fontSize(9);

            const textHeight = doc.heightOfString(
               safeText(text),
               { width: contentWidth - 20, lineGap: 3 }
            );

            ensureSpace(textHeight + 10);

            doc.circle(left + 4, currentY + 5, 2)
               .fill(colors.red);

            doc.fillColor(colors.charcoal)
               .font('Helvetica')
               .fontSize(9)
               .text(safeText(text), left + 14, currentY, {
                  width: contentWidth - 20,
                  lineGap: 3
               });

            currentY += textHeight + 10;
         };

         // ----------------------------------
         // PAGE 1: HEADER AND CANDIDATE DETAILS
         // ----------------------------------

         addPageHeader();

         doc.roundedRect(left, currentY, contentWidth, 94, 5)
            .fillAndStroke(colors.card, colors.border);

         const candidateName =
            userData.fullName || 'Valued Candidate';

         const resumeName =
            analysisData.resumeFileName || 'resume.pdf';

         const jobTitle =
            analysisData.jobTitle || 'Target Role';

         const metadata = [
            ['Candidate Name', candidateName],
            ['Target Role', jobTitle],
            ['Resume File', resumeName],
            [
               'Match Rating',
               `${score}/100 - ${analysisData.matchRating || 'Moderate Match'}`
            ]
         ];

         metadata.forEach((item, index) => {
            const row = Math.floor(index / 2);
            const column = index % 2;

            const x = column === 0 ? 55 : 310;
            const y = currentY + 15 + row * 35;
            const valueX = x + 95;
            const valueWidth = column === 0 ? 145 : 220;

            doc.fillColor(colors.forest)
               .font('Helvetica-Bold')
               .fontSize(9)
               .text(`${item[0]}:`, x, y, {
                  width: 90
               });

            doc.fillColor(
               item[0] === 'Match Rating'
                  ? ratingColor
                  : colors.charcoal
            )
               .font('Helvetica')
               .fontSize(9)
               .text(safeText(item[1]), valueX, y, {
                  width: valueWidth,
                  height: 30
               });
         });

         currentY += 110;

         // ----------------------------------
         // OVERALL ATS SCORE
         // ----------------------------------

         const summary = analysisData.matchSummary ||
            'Your resume has been evaluated against the target job description.';

         doc.font('Helvetica').fontSize(9);

         const summaryHeight = doc.heightOfString(summary, {
            width: 350,
            lineGap: 3
         });

         const bannerHeight = Math.max(90, summaryHeight + 48);

         ensureSpace(bannerHeight + 15);

         doc.roundedRect(left, currentY, contentWidth, bannerHeight, 5)
            .fillAndStroke(colors.cream, colors.border);

         doc.fillColor(colors.forest)
            .font('Helvetica-Bold')
            .fontSize(14)
            .text('Overall ATS Compatibility Score', 55, currentY + 14);

         doc.fillColor(colors.muted)
            .font('Helvetica')
            .fontSize(9)
            .text(summary, 55, currentY + 39, {
               width: 350,
               lineGap: 3
            });

         // Score badge
         doc.roundedRect(435, currentY + 15, 105, 60, 4)
            .fill(colors.forest);

         doc.fillColor(colors.gold)
            .font('Helvetica-Bold')
            .fontSize(25)
            .text(String(score), 435, currentY + 23, {
               width: 105,
               align: 'center'
            });

         doc.fillColor(colors.white)
            .font('Helvetica')
            .fontSize(8)
            .text('OUT OF 100', 435, currentY + 55, {
               width: 105,
               align: 'center'
            });

         currentY += bannerHeight + 22;

         // ----------------------------------
         // SCORE BREAKDOWN
         // ----------------------------------

         addSectionTitle('Score Breakdown Metrics');

         const metrics = [
            {
               label: 'SKILL COMPATIBILITY',
               score: analysisData.breakdown?.skillMatch ?? 0
            },
            {
               label: 'FORMATTING READABILITY',
               score: analysisData.breakdown?.formattingScore ?? 0
            },
            {
               label: 'KEYWORD DENSITY',
               score: analysisData.breakdown?.keywordMatch ?? 0
            }
         ];

         const gap = 12;
         const boxWidth = (contentWidth - gap * 2) / 3;

         metrics.forEach((metric, index) => {
            const x = left + index * (boxWidth + gap);

            doc.roundedRect(x, currentY, boxWidth, 52, 4)
               .fillAndStroke(colors.card, colors.border);

            doc.fillColor(colors.muted)
               .font('Helvetica-Bold')
               .fontSize(7.5)
               .text(metric.label, x + 9, currentY + 11, {
                  width: boxWidth - 18
               });

            doc.fillColor(colors.forest)
               .font('Helvetica-Bold')
               .fontSize(17)
               .text(`${metric.score}%`, x + 9, currentY + 27);
         });

         currentY += 68;

         // ----------------------------------
         // MISSING SKILLS
         // ----------------------------------

         addSectionTitle('Skill & Keyword Gaps');

         addParagraph(
            'These terms appear in the target job description but are absent or underrepresented in your resume.',
            { color: colors.muted, fontSize: 9 }
         );

         const skills = Array.isArray(analysisData.missingSkills)
            ? analysisData.missingSkills
            : [];

         if (skills.length === 0) {
            addParagraph(
               'No major skill gaps identified.',
               { color: colors.forest, font: 'Helvetica-Bold' }
            );
         } else {
            let tagX = left;
            let tagY = currentY;

            skills.slice(0, 20).forEach(skill => {
               const label = safeText(skill);

               doc.font('Helvetica-Bold').fontSize(9);

               const tagWidth = Math.min(
                  doc.widthOfString(label) + 18,
                  contentWidth
               );

               if (tagX + tagWidth > right) {
                  tagX = left;
                  tagY += 27;
               }

               if (tagY + 23 > bottomLimit) {
                  currentY = tagY;
                  ensureSpace(27);
                  tagY = currentY;
               }

               doc.roundedRect(tagX, tagY, tagWidth, 21, 4)
                  .fillAndStroke('#FDFBF7', colors.red);

               doc.fillColor(colors.red)
                  .font('Helvetica-Bold')
                  .fontSize(9)
                  .text(label, tagX + 9, tagY + 6, {
                     width: tagWidth - 14
                  });

               tagX += tagWidth + 8;
            });

            currentY = tagY + 32;
         }

         // ----------------------------------
         // FORMATTING ISSUES
         // ----------------------------------

         addSectionTitle('Formatting & ATS Readability Warnings');

         const formatting = Array.isArray(analysisData.formattingIssues)
            ? analysisData.formattingIssues
            : [];

         if (formatting.length === 0) {
            addParagraph(
               'No formatting issues identified.',
               { color: colors.forest }
            );
         } else {
            formatting.forEach(addBullet);
         }

         currentY += 8;

         // ----------------------------------
         // AI SUGGESTIONS
         // ----------------------------------

         addSectionTitle('Actionable AI Improvement Recommendations');

         const suggestions = Array.isArray(analysisData.suggestions)
            ? analysisData.suggestions
            : [];

         if (suggestions.length === 0) {
            addParagraph('No additional recommendations available.');
         } else {
            suggestions.forEach((suggestion, index) => {
               const label = `0${index + 1}`;

               doc.font('Helvetica').fontSize(9);

               const textHeight = doc.heightOfString(
                  safeText(suggestion),
                  { width: contentWidth - 35, lineGap: 3 }
               );

               ensureSpace(textHeight + 15);

               doc.fillColor(colors.red)
                  .font('Helvetica-Bold')
                  .fontSize(10)
                  .text(label, left, currentY);

               doc.fillColor(colors.charcoal)
                  .font('Helvetica')
                  .fontSize(9)
                  .text(safeText(suggestion), left + 30, currentY, {
                     width: contentWidth - 35,
                     lineGap: 3
                  });

               currentY += textHeight + 15;
            });
         }

         // ----------------------------------
         // FOOTERS ON EVERY PAGE
         // ----------------------------------

         const range = doc.bufferedPageRange();

         for (let i = 0; i < range.count; i++) {
            doc.switchToPage(range.start + i);

            doc.moveTo(left, 790)
               .lineTo(right, 790)
               .strokeColor(colors.border)
               .lineWidth(0.5)
               .stroke();

            doc.fillColor(colors.muted)
               .font('Helvetica')
               .fontSize(8)
               .text(
                  'ResumeIQ - Confidential AI Analysis Report',
                  left,
                  802,
                  {
                     width: 350,
                     align: 'left'
                  }
               );

            doc.fillColor(colors.muted)
               .fontSize(8)
               .text(
                  `Page ${i + 1} of ${range.count}`,
                  450,
                  802,
                  {
                     width: 105,
                     align: 'right'
                  }
               );
         }

         doc.end();

      } catch (err) {
         reject(err);
      }
   });
};

module.exports = { generatePDFReport };
