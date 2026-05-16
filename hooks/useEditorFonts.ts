import { useFonts } from 'expo-font';
import {
  CormorantGaramond_400Regular,
  CormorantGaramond_700Bold,
} from '@expo-google-fonts/cormorant-garamond';
import {
  GreatVibes_400Regular,
} from '@expo-google-fonts/great-vibes';
import {
  DancingScript_400Regular,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';
import {
  Cinzel_400Regular,
  Cinzel_700Bold,
} from '@expo-google-fonts/cinzel';
import {
  Lora_400Regular,
  Lora_700Bold,
} from '@expo-google-fonts/lora';
import {
  Montserrat_400Regular,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { Sacramento_400Regular } from '@expo-google-fonts/sacramento';
import {
  Raleway_400Regular,
  Raleway_700Bold,
} from '@expo-google-fonts/raleway';
import {
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from '@expo-google-fonts/josefin-sans';
import {
  BodoniModa_400Regular,
  BodoniModa_700Bold,
} from '@expo-google-fonts/bodoni-moda';
import { Allura_400Regular } from '@expo-google-fonts/allura';
import { PermanentMarker_400Regular } from '@expo-google-fonts/permanent-marker';
import { KaushanScript_400Regular } from '@expo-google-fonts/kaushan-script';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { PatrickHand_400Regular } from '@expo-google-fonts/patrick-hand';
import { BungeeInline_400Regular } from '@expo-google-fonts/bungee-inline';
import { Ultra_400Regular } from '@expo-google-fonts/ultra';
import {
  CormorantSC_400Regular,
  CormorantSC_700Bold,
} from '@expo-google-fonts/cormorant-sc';
import { Bangers_400Regular } from '@expo-google-fonts/bangers';
import { Prata_400Regular } from '@expo-google-fonts/prata';
import { AlexBrush_400Regular } from '@expo-google-fonts/alex-brush';
import { PinyonScript_400Regular } from '@expo-google-fonts/pinyon-script';
import {
  Oswald_400Regular,
  Oswald_700Bold,
} from '@expo-google-fonts/oswald';
import {
  AmaticSC_400Regular,
  AmaticSC_700Bold,
} from '@expo-google-fonts/amatic-sc';
import { Rye_400Regular } from '@expo-google-fonts/rye';
import {
  Caveat_400Regular,
  Caveat_700Bold,
} from '@expo-google-fonts/caveat';
import { EBGaramond_400Regular } from '@expo-google-fonts/eb-garamond';
import { Spirax_400Regular } from '@expo-google-fonts/spirax';

export function useEditorFonts() {
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_700Bold,
    GreatVibes_400Regular,
    DancingScript_400Regular,
    DancingScript_700Bold,
    Cinzel_400Regular,
    Cinzel_700Bold,
    Lora_400Regular,
    Lora_700Bold,
    Montserrat_400Regular,
    Montserrat_700Bold,
    Sacramento_400Regular,
    Raleway_400Regular,
    Raleway_700Bold,
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    BodoniModa_400Regular,
    BodoniModa_700Bold,
    Allura_400Regular,
    PermanentMarker_400Regular,
    KaushanScript_400Regular,
    BebasNeue_400Regular,
    PatrickHand_400Regular,
    BungeeInline_400Regular,
    Ultra_400Regular,
    CormorantSC_400Regular,
    CormorantSC_700Bold,
    Bangers_400Regular,
    Prata_400Regular,
    AlexBrush_400Regular,
    PinyonScript_400Regular,
    Oswald_400Regular,
    Oswald_700Bold,
    AmaticSC_400Regular,
    AmaticSC_700Bold,
    Rye_400Regular,
    Caveat_400Regular,
    Caveat_700Bold,
    EBGaramond_400Regular,
    Spirax_400Regular,
  });

  return { fontsLoaded: fontsLoaded || !!fontError };
}
