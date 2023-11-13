


const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    const url = 'https://www.juancitosport.com.do/deportes/';

    await page.goto(url);

    // Espera a que el iframe se cargue completamente
    await page.waitForSelector('iframe[name="sports"]');
    await page.waitForLoadState('networkidle');

    // Encuentra y selecciona el iframe por nombre
    const iframe = page.frame({ name: 'sports' });

    // Cambia al contexto del iframe
    const iframePage = iframe;
    console.log('URL del iframe:', iframe.url());

    // Espera a que los elementos de tipo checkbox no marcados se carguen en el iframe
    await iframePage.waitForFunction(() => {
      return document.querySelectorAll('input[type="checkbox"]:not(:checked)').length > 0;
    }, { timeout: 120000 });

    // Realiza un desplazamiento de la página hacia abajo para cargar más contenido
    // await iframePage.evaluate(() => {
    //   window.scrollTo(0, document.body.scrollHeight);
    // });

    const elements = await iframe.$$('.colSubHeader');
    const results = []; // Array para almacenar los resultados

    // Función para determinar el momento de apuesta basado en el título
    function determinarMomentoApuesta(titulo) {
      if (/Apuesta\s*al\s*Partido/i.test(titulo)) {
        return 'ApuestaAlPartido';
      } else if (/Total\s*Solo\s*por\s*Equipo/i.test(titulo)) {
        return 'totalSoloPorEquipo';
      } else {
        // Agrega más casos según tus necesidades
        return 'otroMomento';
      }
    }

    for (const element of elements) {
      const elementText = await element.textContent();
      if (elementText.trim().endsWith("Props")) {
        console.log(`Saltar elemento: ${elementText}`);
        continue;
      }

      // Verifica si el elemento es visible y habilitado
      if (await element.isVisible() && await element.isEnabled()) {
        await element.click();
        await iframePage.waitForTimeout(4000);
        const maximizeButtons = await iframe.$$('.back_header.rowBZHeadersListWidth');

        for (let i = 0; i < maximizeButtons.length; i++) {
          const button = maximizeButtons[i];

          console.log("click");

          if (i === 0) {
            console.log("// Salta el primer div y pasa al siguiente");
            continue;
          }

          if (await button.isVisible() && await button.isEnabled()) {
            await button.click();
            await iframePage.waitForTimeout(5000);

          }
          if (i === maximizeButtons.length - 1) {
            await iframePage.evaluate(() => {
              window.scrollTo(0, 0);
            });
      
            await iframePage.waitForTimeout(2000);
          }
        }

        // Espera 2 segundos para ver si aparece una alerta
        await iframePage.waitForTimeout(2000);

        const divs = await iframe.$$('div[id^="bzSHE_"]');

        for (const div of divs) {
          const titleApuestaDelPartido = await div.$('.SchBZHeaderTitle');
          const titleDelPartido = await div.$('.colEventInfoEventTitle.colEventInfoStyle');
          const dateApuestaDelPartido = await div.$('.colEventInfoDate');
          const teams = await div.$$('.colParticipantInfoParticipant.colParticipantInfoStyle');

          // await titleApuestaDelPartido.waitForSelector('.SchBZHeaderTitle');
          // await titleDelPartido.waitForSelector('.colEventInfoEventTitle.colEventInfoStyle');
          // await dateApuestaDelPartido.waitForSelector('.colEventInfoDate');

          const result = {
            seccion: {
              titulo: '',
              subTitulo: '',
              date: '',
              equipolocal: '',
              lineaequipolocal: {
                ApuestaAlPartido: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                totalSoloPorEquipo: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                apuestaAlaPrimeraMitad: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                apuestaAlaSegundaMitad: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                apuestasAlPrimerCuarto: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                apuestasAlSegundoCuarto: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                totalSolo: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                totalSoloPrimerCuarto: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                totalSoloPrimeraMitad: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                totalSoloSegundoCuarto: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                primerTercio: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
              },
              equipovisitante: '',
              lineaequipovisitante: {
                ApuestaAlPartido: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                totalSoloPorEquipo: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                apuestaAlaPrimeraMitad: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                apuestaAlaSegundaMitad: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                apuestasAlPrimerCuarto: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                apuestasAlSegundoCuarto: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                totalSolo: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                totalSoloPrimerCuarto: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                totalSoloPrimeraMitad: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                totalSoloSegundoCuarto: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
                primerTercio: {
                  line: '',
                  puntos: '',
                  totaldeljuego: ''
                },
              },
            },
          };

          if (titleApuestaDelPartido) {
            result.seccion.titulo = await titleApuestaDelPartido.textContent();
          }

          if (titleDelPartido) {
            result.seccion.subTitulo = await titleDelPartido.textContent();
          }

          if (dateApuestaDelPartido) {
            result.seccion.date = await dateApuestaDelPartido.textContent();
          }

          
          const spanTexts = [];
          const trElements = await div.$$('tr:not([class]):not([id])');
          for (const trElement of trElements) {
            const tdElements = await trElement.$$('td');

            for (const tdElement of tdElements) {
              const spanElement = await tdElement.$('span.ptsOdds.ptsOddsHover');
              //const spanElement = await tdElement.waitForSelector('span.ptsOdds.ptsOddsHover');
        
              const textContent = spanElement ? await spanElement.textContent() : '';
              spanTexts.push(textContent)
            }


           console.log('spanTexts:', spanTexts);

            if (spanTexts.length >= 6) {
              const momentoApuesta = determinarMomentoApuesta(result.seccion.titulo);

              switch (momentoApuesta) {
                case 'ApuestaAlPartido':
                  result.seccion.lineaequipolocal.ApuestaAlPartido.line = spanTexts[0];
                  result.seccion.lineaequipolocal.ApuestaAlPartido.puntos = spanTexts[1];
                  result.seccion.lineaequipolocal.ApuestaAlPartido.totaldeljuego = spanTexts[2];
                  result.seccion.lineaequipovisitante.ApuestaAlPartido.line = spanTexts[3];
                  result.seccion.lineaequipovisitante.ApuestaAlPartido.puntos = spanTexts[4];
                  result.seccion.lineaequipovisitante.ApuestaAlPartido.totaldeljuego = spanTexts[5];
                  break;

                case 'totalSoloPorEquipo':
                  // Lógica similar para 'totalSoloPorEquipo'
                  break;

                // Otros casos para diferentes momentos de apuesta

                default:
                  break;
              }
            }
          }

          const teamTexts = [];
          for (const team of teams) {
            const text = await team.textContent();
            teamTexts.push(text);
          }

          // Asigna los valores de los equipos
          if (teamTexts.length >= 2) {
            result.seccion.equipolocal = teamTexts[0];
            result.seccion.equipovisitante = teamTexts[1];
          }

          results.push(result);
        }

        await iframePage.waitForTimeout(4000);
      } else {
        console.log('El elemento no es interactuable o visible.');
        continue;
      }
      console.log('Result:', JSON.stringify(results, null, 2));
    }

    console.log('Resultados:', JSON.stringify(results, null, 2));

    await browser.close();
  } catch (error) {
    console.error('Hubo un error:', error);
  }
})();
