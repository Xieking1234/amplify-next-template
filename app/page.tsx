"use client"
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs)
import FlipCard from "@/components/animata/card/flip-card";
import SwapText from "@/components/animata/text/swap-text";
import PageWrapper from "@/components/animata/pagewrapper/page-wrapper";
import SearchDropdown from "@/components/animata/searchbar/searchbar";
export default function App() {

  return (
      <main>
          <div>



              <PageWrapper>
                  <div className="flex justify-center mt-20">
                      <SwapText
                          finalText="That fits your Story "
                          initialText="Discover University"
                          supportsHover
                      />
                  </div>
                  <div className="p-4 gap-20 mt-40 flex justify-center">
                      <FlipCard
                          description="Oxford, established around 1096, has produced over 70 Nobel laureates and is globally recognised for pioneering research and academic excellence."
                          image="https://ih1.redbubble.net/image.2716945512.0313/fposter,small,wall_texture,product,750x1000.jpg"
                          rotate="y"
                          subtitle="About"
                          title=""
                          url="https://www.ox.ac.uk"
                      />
                      <FlipCard
                          description="A modern, career‑focused university ranked in the top 25% globally for research impact and 6th in the UK for facilities."
                          image="https://761723.selcdn.ru/studyqa-medialibrary/2683611/uni_profile_69561.jpg"
                          rotate="y"
                          subtitle="About"
                          title=""
                          backBg="black"
                          url="https://www.herts.ac.uk"
                      />
                      <FlipCard
                          description="Founded in 1209, Cambridge is one of the world’s oldest universities, known for Nobel‑winning research and its historic collegiate system."
                          image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABrVBMVEX///8AAADmKyfkGxX99/cdHRvqLCjkAAD97+/i4uLtLCjlEgr3w8L09PTX19f4+Ph+FxWxsbGLi4qXl5exIR7/5Q/q6uoGBgD/6RD/4Q8SEg/JyclAQEAZGRcMDAl7e3rExMSmpqb/8BBhYWDQ0NA6Ojnb29sAGhuenp66urqIiIfgKibv0g5ubm1PT07nyw6iGBUwMC5bW1u9pgvXvQ3RuAytmAp2dnbQJyMlNDQmJiRJSUidigkAFwBIPwTArArCIyEyLAOCcgiIABgoAAggAAhVABBYTQWQfwg1AAtnABNoWwZjABOeABx1ZwdRAA94ABZmExGFfgQ8AAwAJwCRGRl3cgMAHQCAABciHgJQUADGFyI6AAs5MgNBSQCvnwkWAAd+AABMFAw0FgiJGRcUIgAhCwUuOABGIAoeHQFLPQYwIwRlYgE4OwAhKgBYRwdgIQ9YMQxxXQgmQABxNBAGDxw1HACaOhfHixO7dhSkURbnvBHAOx7TeRnGVRy0ACDuaSHsWCPkpBbxqxfWrg7rQCb1nBv3jB72dSHYSSHgjRngdB3AlpUfNgCnAAAfBKfsAAAeTElEQVR4nO19i3viSHYvhx00QQnIPAQSmKexLyBh2UZgxaYNjR9gY/BrzLjttvH2uKenZ9w9u8nNc5N4NsluMpPs/s33VOmJH93ryZduzVx+/X3uQqik+qlOnVdVCY9nggkmmGCCCSaYYIIJJphgggkmmGCCCSaYYIIJJphgggncg0g4UsyFSslCcG7O/z/H3FywkMyWQrlIuBz72Nx0rML/Gvwfm5uOChxMvQe/LIdvo/zLsTOu7la6AnBJH5YhytrQNHYMDPnz6Sd3q/1i7KwWexeQDnx4NvchAlFGYr0EUot98YUkYYlhbtZP+mde9moXv/r0z+7U+uQXeLpey9tiT162vKQae7Z+sn4jsdENLIPvI7C5Dznsw4Nj0lh2Afaa6hEsMIy23VDV0XBzf/OwzzzAkLmaYhh8GBpsDeWjywPWy2wNa0rz8NnOUWMX+3DlI7C5D4RhFLYYLyPtKANB7slHrPcLWVZFparUGuKl3oexjFUjUjD6EDYk5Ngf1RW+Jz71srs1XpXluqo0xJcSC4sfkZUThGHrtLHFRt+uybwo8mJnvT+qoSpsyI1Ot7ehM0ymOLPGdE5nyD6pXjLal52qgLX49pY2FLHWQB512l1wGcP+ofCZtj/Kj9qC3K0Jr/blizPvMbxtqgPQDCnNWTVCAV1Kz07z18f9YV5eE8V6I1/fqR72URygrjRwbLMw+/FIjYEw3GnmB/3ocKRAu/taafb2lc52lPFebcIREqQMA7aUhmM6w+gwX92SXqnqt2tNQI77oy4cS+zCc9iMsl5XMdSePxW728zWqao2a2rtdOqmUVs7haiXJePMGIe2ZqxkKUNtB9QaaMendbkh1sXOV9qp+PqacJS8jNdVDFt7zW6zfTjFXo6qtVqzuok6RG3ydXiy5WVNhjmwrBssE4bs+mGz0Wx/xe4MlapaV0Bj9+qqqMLLbY11GcOodsrXeuJX7Nlh9+lar95HCw51MT+Qm7BrSKkfYNWokAFIUk1zKVTrakfyft2EHtR2WEaCoZyvNxU4arlMShlQ853qPtv6XO02lVM0joy28XlDFvPtIbSopinmVkJJev5cbqZcJAzZrXq+3viKlUDpid3GHtaS9qCtyPlq78kx6yqG7BWg0kQdEa+3GypcSizDsNEjOB2JQhMkKqXcslWj7Dc0DdSr0GI1GNTbaF1apFZrF141ZF7GT65iuN/IHx6zzLoqyAqfH8CCpmkS441uQSN/ccxQa0EDhQj54+cMhqf55hbLnNXzosrn63BMannZ6A5ci91ddzGMfi42+wyzrii8KPQaAPFnT59+s31ypoHaPWEtr20O5oyS7tOo8i4yHGEtvjtCa09qfbFzI+01ahvuYRgi1vnoXD1i0etayw+UOLRVWRAEtaY2OgPh1OhDiohZoD7NFKhfetn+aE2oj9rQqcm8IMhNtd7ryPUtFqY/DqE7oAy3GuL1+tmT5pryGkAVeLHGi3IXujUyPh2ed8UsEIbM8alY39K+rHdHPfRkBJ5vYq0qDJpqg4xDNzFkom95sddT6wL0iI/JCwNZFIUGbFxuaY7YgrNcTcpQA0Vov1EH+bVnMq1Vr6K8qljreYtxF0MMC3qKICidfFUWGnK903vaQXdaxJ5gGUd8GISCUSIMvezxWxXFeY1XVWEkVzudDmAllGuMf70uY8gsoCETRyDzvIIaYwt6vbogCtcnaPwdfbhoxXyUIXZip8bX4k2eJ1HFLjztDgSRrx9hLbcxRL1YUy6fQx2jIDhmWkO0aAqOK5CiL1iLYTHsCxf1ImWIIe8hf/4cBgKeOSV5vxWFpxhKyaBJJHpyF0NG+/xrid2o84KCormr8sLaa5HHkfhk2xnjm56bwRA9t4sWe3KNfYheTB+VTYM8mFo87j6GaKgPWGZT5uuHRwy72xBk2Pi8hto/b+jSQIicnCV/SjGLIaOhkdlq8jUS8h6fCsL5NqAjJOSvXaZLSeoJ1U3/UBbam1iOxmXxUlrY/BzDos91hiGwYvx00ZJSrMWcdUQcwRqDo1IVLs5aR/G22DyNuoshw/T7XlZ7w4/qcRISsjtdofnNFattVGumXxqyawRMXXrTl1h2W1a6KKvkCb0RlLUtVttt41B0F0MNRs3Tg3NZqOMgPDtDjiCq2GrvbjP/0pDSsFUjbDJ8flgb/upSQQvYZ7UzL4Nka4frLNM/zA9d1ofS8UBUB2KzEde828PGgfesI7zc0V4kXoldow9jlpLxVOYMhgvfKvJAkbuvouzOaf3XmvRc6G1Ku9+A3HjjMoYolsRQqIChYesUe3KgCG+lc7GrCo1NM8a3akDElNIodEU0Dhgaal/JCnytCtfRA6Vaz9fcJqVe6a94uZ0f7mMUe4Z+JTo2r9ajf93ryk1xk1qLAIAZIEbIlIvO8P/KYltublOz0akrYu3tnvTZEB3x/OcusxbMuoweqbxBlOqGmK92+Ot1VpJQhzxTNijD5fJKJkvPL2Smlyu6X3rWzA/iaE6I16fmlXO5sYe+w05TiMtus4fsr4afwcFfk/RF9OJwCNVDFDwv+1XzGv6wpfs0gRmrxrJhD9n14RvYuSAzGxI0DmFQBS+S3R8N4W3abQyBqP0rCftl4aDfj8I+ncfYODr2tqZ0n4bLWjWSnMHwYF1j2Sg6roy2ddyPfnFEs4hTlyeaduAyhl6a/2OoEac5Gt0lI6aRYR6cezJq0Wo0R6PRokQ/uM7zHsetAw8xvF1rrJqbGP7xF+/BfQw/fV+lP3cRw9In7wMOwxLJtcVKJPGdJWHw++u4iGGW/OeYkeZuF5PJwvQ5lJJZ+PpvCoUyQKSQ1IN9R607RbcxTFlpNE/CLvrojBPG738rdMncYP5b/KuQyUXq4jgcnZA9r2HkHN3GMGL3QdFeJZLT2zp1/Hf8369frf+D8I9XV+vyb9aPp/4P+SJmPwvOLnrK9K/bGOYcR2K3inDc+ifhh5vozT/n/yUavZF/c9M6pgwDRbuW4wJ6GOI2hhW745btYjlI/kLLK333OxLufod/mN/+VmJaeh/akxn+JfuSerrKbQxX7Qh32i4u0U6Cs3+VJYep+53wg86wZI/Dgl0M6EuFXMZwzp5lCNpLDGL6mhhoffeDkbTQvZYfvtcZTkPSPHUeSmaxDFRM3cXQnwJA1zqGOsKfAKjoq0tivjQQ4YMWZfbdv/17899//zvKlTKspNNpFONygbACki0uhoiCBSCD0l0MOU+lENCXlHCe5SAWC76Ah+PKJWIRySyp1/v7eq9aq5/WvrMYBvwVYjHnQ6Q4T8zgcphYQx9HFLO7GOrJF/xA/uSopsnZRcqQ+c01DNodGP2HxdAToCaCZBc9HJXMAj1fX7bhNoYUnJ1u8thq0uhD5ve1w2HjN/9pS6mBsK17Q0lHLTcyjNnLmPyOVWnQkr6nvH77n7+lquZ7r5PhjE0r4rCKrmToWFKSc6x/RWvBO63F9/kfHAw5sLt7xc7IuZKhH6xWxcAxSQ2t7/+LceKff+dgOAOWzQgD2F6OGxkWcz5zIOWKK/aYgl8u9Bec6C/80mIYzK0Wc3oM4s9VMjnL5XMjQw9np5s4hxc2PU8Wg/+lCVp2iKNT09jXchNDh/6bu7dIHDGwlmEkjdDJgmM5d8ARW7qI4X//xfvwib8tfm1OcJeqMjJ8b52/cBHDP/75e/Dpn/m7eZthjQfPJ5++r5Kb8jTOXBtzJ+9Gc22xtUYiaFTIDhownmtjpHtquSfXVnIwZNmpLZauuqdpU/M49uHXdWsZRsliaJzAtsiaNq8z+qCrL1ffed8PB8pQozsLpJ3+sLG/ccx4WW1rc2PnjK4TJQwDmTLd4xNGTTKXKWfourbWC43k/o93v1C+6C/Q5HC039dYlpHQzWNh/mNTM5AlMzMtWGe97M3hdU18o2yx7MJnNUGuXe9p7PaVY6WCH0xRpVn9+KsFlmWfjtr5tdFXDJlsG44a15cn2sJnGsPC0kO3/MAokP0VZ6ejdba/XSOr7uX4sfRaFEW1IatP9zqnmmNdm+WZ07mnJ+IftKm/HeRlXs1f37DRV7LI1xq10ZvXoxOWgcr9N/zg8MMxy0aH+YuzC16uI8GmeH0yqgN0+W5daMoXToaWR0Cl9I0w2v9aELsyL1fl4dm23IaXI749UPL1fVaCzP03/OAIwBTbWr/ID6Mbsto7V0FWB7sqsK2NN3JzrX2x51xPs2ha9E9+wWgHoDRPXshqHRRQlFH/urnLtjYvFCR6JDEaRB6444cGBwcMNHriq/Wb67ZYl2ty71frtScSy+7D9SEsjK9ryxolwvAzpdr9sn/dFqrY771vz4bNHYZljy/Pz49ZMrRz99/ww2Nlj11vCOLgUFp/o9TxH0g3jTrs3LBStE+0pXNdW8ookXEIcr5T2+9f1wb1tgpR9oJ/CfsLGisRxcxE7dTUx8b8pldDKaufauyvm0+7UOuz3g25fj2Cty+iXidDDDgihuiRlez71/zaYZ99qz6rdkZ9lt0bic0mnG5Ry8McWwb0o2MZJHarIz+5Yr1Qa1ebh33UrTBS8kpXvIadsRlSy8QRTbPwUn2zjzpTbdeVN2hyJFRO+apcg3U6FQwu2X6IUSF6JPv1PLRQObyu1dW1XRxF0t6TYU0W+GrjyNA0tL00DCElwvB4KLzVsFJbqTZeXumVurIgDA530Lhupbl33fVDIonmIvqSb6yz2qkgCnz+YgrVDCutb8PbrpK/WKDWomDveSUJX2otQLmQyEpNXhBUWCCVNNRONVG4QDfJNS4NVaY4ht6IX0pELzbFpgpwebTTP2O8rXVoNvf0tfplq0LR3G8xFIY37Hq9ztdkpQOwubV+w7DR7R7f3GE1KD98yw8N3yW29jqvQmdQb4AygF5VVWv14Ze7fe3ksLatM7StW87Yndd6JSiw/6w6UDpNeNqoqWr18OutG2ariYZxAbIfi89dhHEISlDlhXyjCtgXKo8QBUFpjoYN8WKKMuTsxFTGb/il0BPlWrP2FIP+riDwIi/U6spo2BXfRNkX4JphSIbYFIvmq4PuJaAGrfEjvtasK7zYWGs0Xm0aK/fsFq+ae0hBwXHbUKptURV4RVFrPN+ATqPxkvhsbokOKVLAEusmXmxvxklbn76FSyBr0tc2T/qSrkszlhM2R+amKMPdxvDlq9c1XmjytTWA8zdIeHDU77cwOHGPR0MQJr4Zc0Q25regxouwxW40nmKgUL80d1gWURL1aUV/OoFxEY0tWtBnJbI2nMzry83rnSHKdvschZ7ddI81JIjBNtnKPcVqZxgCEdXfH+a7VbIcU9JjfE8g4DOWWHCeTDJg7EYgm2H7h4IIB+t/JQqHZ/1nHUVUgMj88nvu+YExg92HUndyfbh79ipfH+5js5UeBosgWau+7FioaK7ck24woD9B7+ftTYfnZWAk735NRvPKbLvlnRgmYnBJ+uqoIfYuZKG3zWqvBP68Jgin69qxI3oKVEzZoz7NH+oXJ2fPhOqb3SOZ50/Xpw6Hb+V6XGKPXRMbWsigOkU5hTZaivMnZDObInSgK8qDtwf2jhJPbMXsGtKH0S9q4ptTDCePtLcCP4KbhtoW83glDdxkKnRwQNTDSSPfaApEypjoYf56f++JLKh7DobjWQx2Y62uCHkASQNZeLUwtUH2TQEeh9D9t/mYSAJo7MaoCkpjj5XOWPZCUF5o+9eCMrZnxkoukegJH4gqV6/JqyOgKrzW2P5IXrs+YQ/cpmZ0hOE5+2Jvf68B0nGv++udnqg+abEXSm+sD1cc41ACufpUOCfvJGCP6kLvjO0PT2EDwyZXGXsbS/CCwYgCjjVoKt0B6tErlj0VersOhkkrbqcMYSdxuEveYaN9I6KJ0bByS7sC94RNtzAPL7wM09JQ5gaiUB1sstgp+dqmHQGTGSijEwnDF+i6bLA3/Wj/XM53SDCMxmMKVlxl68eAFOm659Z1vs13QWNOoKp2juxxWCqthIxONHd2SXuNZvyar9bgmK6jPoBZ9xIkgrqpodFYbwyfCtCSLg/bsnC6wz6QxaAM+yNlUBP5Hoo0Kldtw0Vx770IA/FNr/b6X5zus9tqfsDLVWM3gj4PSmdJjSwGnZTZ7YxEvkoUsZdBdxvC77q8G1ACmELViA44w2zUeg3x/HBfZ+jIYiTMXUHYhdei3MkP9og+lQ7AOZ3sVvhnYaNF3BuGnbrcrubPNw2vjbuTxSAMNzFq7nSJ90o6cMnNQ9BGBLtRotOBWmsoptGb9t7KYhTN3Xle6Vn1GvbQ5LPaC3BPBvh98K/C5QJ9i5f3m9O++X4azp7vzNh9uL11I3klVpoCWP5pdKCOEMBzuin06jlrxIcYflhfm1kMGiCSUXsMMBt8x/XciDLAC/I2Fn2fD2G4bK12CppZDDqbzbDRS/D9ZATURqwCsGXOzutZjHSWfuNfTEPFYshEn0O6+O5ruRVzS3o/6gxjAZ+xMijAZZIxI4vBIj+IuNUNfT+ChCMZaVSX2rY8Z7zNjIlu/6T5EegcHbPcFpDhAvIL/7T5EQRnALb/eM/bPRe+xP77KRmIh+FfNtbeO0HW4//E5dOJWAbAl7P5cDnfz0I+nYhh0JE2+zGX+NnIpxMccoQi5+GKPy/5dCKAfk4ig/0X/vn1n4kY2fpT/vnyI4iFXfIC6wkmmGCCCSaYYIIJJvj/FGO7FT3/uyu8A+UIIqxvj8dyOEL/ixht8JfDeCznmaOnlUsF/X/apiL5ykNOiNCfy4mUMPTNGB9zjpmz0vJMJUzy3CW99hwH9Hz9zMjyTExvBDmFwwNhe/UJl1taXFldNpLkgXCkWCxGKP70x0LDuCwNc7jYDOQCHo5kd9N64MP5w5BI4jF/BWAxGOCCswApP43aA0mY9ntiIQBfCRGmK5tIBmN2bi67auWjgrA0x/lnyIRiILgIUME6sEyYAqxiczMQ9gSnsRH0hQzkAhkr6MrBTBB7fBniOulYBGA6S2/2iMWMsXjC2r1T0FcnxSCVsJbAzkaMhsb1joaU9VWcPshZ49ws3bnEQYJOXc8n9AnQmLGaZFF/S3uc7DoIVvRv0nS1F4qIJ+BLmeuGIvbuYmsNJz5FfWEYXl3/uviIuYFYOm1tqgqm9euksX3mwaXsGEPPSspcZxfUJ5hmE/qbBzidYUJnWAD9smVjjkYXK51hqeRkmCTdkQWfvnAjYC/EjNjT/GVjY3vAZOh/xAS5k2FBX9zCAYc8jOe3lBxnmIO0McGbiYwx1F+EZTKMpfX/V8fkSWdo3NhgaFwM0rTtq9bE1ByOHrPMYR/HnAw9j0hv3csQCaWM699mGEikfPrlU34nw5ixoNRkaLR4Nu1c8/QwQ24xRaaFS44Xn6YdK/oyafrETYaPSt/dz9BTAv2p3WHoWU7rM9RJozEGw3BwjGHS6IGZRHreTkc9zJAMcB/Hpe3UDn62v81CatXBMPeYKdYHGHpQidLddXcYzhm6ZKZkMfT7/QVjB77JcNpYSoIDLAHW7+K9gyEOu3hm2RbpOZ2TdXJqhaMMl2J+/9zKY5bcPsTQU4nHZ+5jSNQkuYEpQ7Op1OLiYtximJoNhYqL0yaTMvYFxIvvZ+iZTjhXECWNB6kjgAwD5D+fD2/2uB/ae5AhN5sg/XCXYYgWS2Ytw1rMWn04XUBtZLeu5CMcZ97PEAU74vyUcvzIVUD/ZEhpYPHHMgw6GZKr4oi7yxBHCJ4wbzbVGIdF5zjMjDU2t5L26Z/fybAwVsmP9sPRSr1H/+fjUN8SaTAkjxH8M3cZluNQCsTNTwZDjnMwDKC1cTifXCWuq41HMPQgw7nb35kMA49RpoFUwlrLW5odY4i2LzU7fZch6pqZnPXJsocOhqiKE2MrYxdT8FiGZefHHNyyh4/BbCJhPpGMbssthkRNwF2GqGtSvphd32RIXr9u6tKlNPVCzB/RK8KjGaLP4LP3Fumb234cw4i5vwWZ6eLt8Jzm0/cxLDn1nM2Q9Jrt01DvjoubN6n8CQzjYxu6S2Dt2csa3i33oxhysxDPUmKzGfPSVvzCrRgMs8724FE7wllJpemD4SqERMBUgUVIEHu2ojfScB/QNcma9ZL6CTZCYGsEk6L+VAswr/cmmsUftSwc77uYKc8bMhLEQAkqZnznp02ay5DNShXLZwxbDlWZBD7oHKBBRA+UK6fw02qZfEveNFT0VGC+FAwlpol6L5ErQ4Zq+iyJ2mDenv4O0VvMjHnUMYybwrnItE9/noHyCqlT/hE7bLhCKJdLGjfjAgTWnWOkxMXoQUt4OatkfGF+q3+MWdfBB1Zcrhjxqn5WTI8uHWc6vgzcmnDkkqFcyGIUc1xgggkmmMCV4DjOXUqKC8Rij3JA34lAcQkNGviWIs5sbc6ZZsjQXxQfq5XFQ+XlIHHO6JeZTKZczBoKv5yhPzqOhyIh66IReiJ+heWwUc5kwrnk7WUpgeK8/pPr8xmaZowt0zuUKcKPNokBtLbhOZICRZtse5yBtHNFfRB9y/j4EnsMbSFCXkfLFYoQj0MyWAjNotmmzQ2WEvh1LpnNYcS6aHgQc9lpPLiSDdLyLKmfzZYiS+gmOK/MYYMy1FNKLunpEP0Occpy5tFbNeZWwMqloKdkxV6lW15gEXxjjlYSP1txyUzCpzs684n4on61HAZA+mtmLQeeeGA+6zGVrAiJPON569Fig1asVmTM0ysJM3Njv9vnT4Mf0o4XrBZt33gp4RvbRo6Nc8Zsnpm4z3ZWw3Hj5CA2W09aZE2GGDylzFvM4UGTLT4i63miV+ozZG8unnCmKUwfOJO2clPLY6L0PnAribHX36SyRiFAsg/ObGcB41iHc+yH1dQ9DAM+M+K0GZIvjR4KPsCQpL6MdxKlUuNJ1sgdhqFHMYyMpXxQQ5hhQ3FmOTHmypcWy2mfvaOpnFlO2IQththhdxiGbCoPMiRBfVhvkDN/gV0avsPwUeDsKQMdMZPCbCk5lknwhGb94IubMRsHc5m0PVAdfWgkZW4xtOYCHmKYSfvi5Aq+VPre7es/lmHJvvk45oDcLO54cUxuFYdmKmEMzdCsp5y2u99imIWETz/FKaXWOHyYYUnXQUmHKhqDxTD5uJfZlOO++L1mtVyhj9UhMJEZentjjKyESMMtKSYMyXX8cZg1pMBmOJ2A7HsZooCQzsuNHbyPYflx+xbnEzSbfBfppK7as9aR8jK2NZVKGS3lcMTYOU1kmM7lIjNQtmyVxTAM9kB4mGEs5aOZyPQDQoVf+ArJZDLyyLfXoSJfvO94ls60oV60TWKlrI8oKkMzZWogU+bTIQwjxUhmEZZMRYgM08VQqDgLy3ak+zBDbiVFRGL5HQxTiUQiDY9kOJu6vw9nqLATvWa1bolcGeiD9sTIYSJQDoZ6GV0fIyVNGIZzFZpY/tMYEofiHX2IUoq+c2zxcQznE7773kvBQWguGJwrgcMkrhYNzmg+I8S5CYHtEtjWAg2b/syy+uNBKXHc4WGGqISJwBQdJ3ChUhahT6la4zD0uHGImua+gR1Kz08j5ld8tjJZJFxjadoOyNoUbjEMgGEujHGInNK2qL9T05CnWbJ8IsKQJq+WxhnOPW7721gv2Zg3JMGp2Vbojcg4iZXovQoOe2kzJMpr2sHQsxx36P93Wws/fUC2t6vz4qzSo6gZiMV9t/KW9KjZNzHbxnOJLPkPHct4eDVyu7UOhjMJ3fqZDAOof6309cMMZ4xk8szYuMlZ+vrHMvRk4r67wUjEEk1yP70UMNxXPJLWyfgdxsTBcNVw2yxrgb0TN927Bxn6TYEImlJOUbyfYfYxE/mJW/ZimaPm3EDIYhEzJBLblV62GmWeaDOMmUdti08eU/Y9DOcT5hsIlvGBWNr0AYa+xwT/SUjFHXHgzCJphmUiOBwWFYOPMeZWUkZvxhwMIxbDTDqui73NEE80bdLt6MkMaypgv0p4FRLTJgMnQ1/aPCP0uPdNJBNowrK0GAjRmeZpcKwY8BkPOmwv4DEWDREtaTaLWB3KtgxmPE1IG0oMFZbxFEMOVZmz6icXxzb1VSBuhsD2OCR30M8J5B77wokA2aG0srRcmYYEtjLsA0hl6MPlInReApa5CMmbLNFtTJxORZ+GoHMPsfCskVSZScC03oziEj1U0Xeukcv4yh5d+0OFcMzp5ZWlmVWsVBzbYFPC8+dzJMGB1IlExMKr9Oz4yuKKD37ECwsCpfDM9PRSOEs+BAkK+h0LQf2Tx/ifCo8+xeG3vvNwRjFYKATNlhYKxhF9JVmBFD1zxkHSQUGzUjDov7s/KhiZWUynZmfC9JcGPYGkebcCuXDBXWnBCSaYYIIJJphgggkmmGCCCSaYYIIJJphgggkmmGCCCX52+H/EY1PRixiytQAAAABJRU5ErkJggg=="
                          rotate="y"
                          subtitle="About"
                          title=""
                          backBg="#300000"
                          url="https://www.cam.ac.uk"
                      />
                      <FlipCard
                          description="A world‑leading university ranked 2nd globally and 1st in the UK and Europe. Known for excellence in science, engineering, medicine and innovation."
                          image="https://i.pinimg.com/564x/ed/a2/5c/eda25c36a6813a03a54ec84fe0d32686.jpg"
                          rotate="y"
                          subtitle="About"
                          title=""
                          backBg="#b38b00"
                          url="https://www.imperial.ac.uk"
                      />
                  </div>
                  <div className="p-4 gap-20 mt-20 flex justify-center">
                      <FlipCard
                          description="Top 10 universities globally for social sciences, consistently placing in the world’s top 5 for Economics and Politics."
                          image="https://advancedcommunities.com/wp-content/uploads/2022/08/lse_featured.png"
                          rotate="y"
                          subtitle="About"
                          title=""
                          backBg="#300000"
                          url="https://www.lse.ac.uk/"
                      />
                      <FlipCard
                          description="A modern, career‑focused university ranked in the top 25% globally for research impact and 6th in the UK for facilities."
                          image="https://images.seeklogo.com/logo-png/35/1/university-of-bath-logo-png_seeklogo-356087.png"
                          rotate="y"
                          subtitle="About"
                          title=""
                          backBg="#B3B3B3"
                          url="https://www.bath.ac.uk/"
                      />
                      <FlipCard
                          description="Ranked 9th globally in the QS World Rankings 2025. Member of the European Research Universities, known for world-class research."
                          image="Resize the provided .png"
                          rotate="y"
                          subtitle="About"
                          title=""
                          backBg="#2E1A47"
                          url="https://www.ucl.ac.uk/"
                      />
                      <FlipCard
                          description="Ranks in the UK’s top 15 and is a leading Russell Group institution, known for high student satisfaction, and strong graduate outcomes."
                          image="https://applywave.com/wp-content/uploads/2023/07/leeds-logo.jpeg"
                          rotate="y"
                          subtitle="About"
                          title=""
                          backBg="black"
                          url="https://www.leeds.ac.uk"
                      />
                  </div>
                    <div className="flex justify-center gap-10 mt-20 mb-20">
                        <SearchDropdown />
                    </div>



              </PageWrapper>
          </div>
      </main>

  );
}
